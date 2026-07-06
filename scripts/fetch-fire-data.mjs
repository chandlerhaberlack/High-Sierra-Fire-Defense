// One-time / annual refresh script for the wildfire map data.
//
// Downloads historical fire perimeters within ~100 statute miles of Lake Tahoe
// from two public sources and writes generalized GeoJSON into public/data/:
//
//   1. CAL FIRE FRAP "California Historical Fire Perimeters" (California side)
//      https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/.../California_Historic_Fire_Perimeters
//   2. BLM Nevada Fire Info perimeters (Nevada side)
//      https://www.nevadafireinfo.org/data
//
// Both perimeter sets are normalized to a common property schema
// { name, year, acres, cause, src } and merged into fire-perimeters.geojson,
// sorted by year ascending so newer fires draw on top in the map.
//
// Data is updated by the agencies annually; re-run this script to refresh:
//   node scripts/fetch-fire-data.mjs
//
// Attribution requirements: cite "CAL FIRE FRAP" and "BLM Nevada Fire and
// Aviation / Nevada Fire Info" and include the "provided as is, no warranty"
// disclaimer wherever the data is shown.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "data");

// Lake Tahoe center; every query pulls features within RADIUS_MILES of it.
const CENTER = { lng: -120.0324, lat: 39.0968 };
const RADIUS_MILES = 100;

// CAL FIRE records go back to 1878 but are sparse and unreliable before the
// modern era; 1950 matches CAL FIRE's own curated "1950+" layer.
const MIN_YEAR = 1950;

const BLM_BASE = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services";
const CALFIRE_BASE = "https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services";

// CAL FIRE CAUSE coded-value domain.
const CA_CAUSE = {
  1: "Lightning",
  2: "Equipment Use",
  3: "Smoking",
  4: "Campfire",
  5: "Debris",
  6: "Railroad",
  7: "Arson",
  8: "Playing with Fire",
  9: "Miscellaneous",
  10: "Vehicle",
  11: "Electrical Power",
  12: "Firefighter Training",
  13: "Non-Firefighter Training",
  14: "Unknown",
  15: "Structure",
  16: "Aircraft",
  17: "Volcanic",
  18: "Escaped Prescribed Burn",
  19: "Illegal Alien Campfire",
};

const SOURCES = {
  caPerimeters: {
    url: `${CALFIRE_BASE}/California_Historic_Fire_Perimeters/FeatureServer/0`,
    where: `YEAR_ >= ${MIN_YEAR} AND STATE = 'CA'`,
    outFields: ["FIRE_NAME", "YEAR_", "GIS_ACRES", "CAUSE"],
    // ~55m simplification keeps polygons crisp at regional zoom while shrinking the file.
    maxAllowableOffset: 0.0005,
    normalize: (p) => ({
      name: p.FIRE_NAME,
      year: p.YEAR_,
      acres: p.GIS_ACRES,
      cause: CA_CAUSE[p.CAUSE] ?? "Unknown",
      src: "CAL FIRE FRAP",
    }),
  },
  nvPerimeters: {
    url: `${BLM_BASE}/BLM_NV_Wildland_Fire_Perimeters/FeatureServer/0`,
    where: `Year >= ${MIN_YEAR}`,
    outFields: ["IncidentName", "GISAcres", "FireCause", "Year"],
    maxAllowableOffset: 0.0005,
    normalize: (p) => ({
      name: p.IncidentName,
      year: p.Year,
      acres: p.GISAcres,
      cause: p.FireCause,
      src: "BLM Nevada",
    }),
  },
};

const PAGE = 2000; // ArcGIS maxRecordCount per request

function buildUrl(cfg, offset) {
  const params = new URLSearchParams({
    where: cfg.where,
    geometry: `${CENTER.lng},${CENTER.lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    distance: String(RADIUS_MILES),
    units: "esriSRUnit_StatuteMile",
    spatialRel: "esriSpatialRelIntersects",
    outFields: cfg.outFields.join(","),
    returnGeometry: "true",
    geometryPrecision: "5",
    f: "geojson",
    resultRecordCount: String(PAGE),
    resultOffset: String(offset),
  });
  if (cfg.maxAllowableOffset > 0) {
    params.set("maxAllowableOffset", String(cfg.maxAllowableOffset));
  }
  return `${cfg.url}/query?${params.toString()}`;
}

async function fetchAll(name, cfg) {
  const features = [];
  let offset = 0;
  for (;;) {
    const url = buildUrl(cfg, offset);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status} at offset ${offset}`);
    const json = await res.json();
    if (json.error) throw new Error(`${name}: ${JSON.stringify(json.error)}`);
    const batch = json.features ?? [];
    features.push(...batch);
    process.stdout.write(`  ${name}: ${features.length} features\r`);
    // The service may cap a page below our requested size, so advance by the
    // actual batch length and rely on exceededTransferLimit to know when to stop.
    const more = json.exceededTransferLimit ?? json.properties?.exceededTransferLimit ?? false;
    if (!more || batch.length === 0) break;
    offset += batch.length;
  }
  process.stdout.write("\n");

  // Normalize to the shared schema and drop features without a usable year
  // (the map's year filter and color ramp both depend on it).
  return features
    .map((f) => ({ ...f, properties: cfg.normalize(f.properties ?? {}) }))
    .filter((f) => Number.isFinite(f.properties.year));
}

function collection(features, extra = {}) {
  return {
    type: "FeatureCollection",
    metadata: {
      region: `Within ${RADIUS_MILES} miles of Lake Tahoe (California and Nevada)`,
      center: CENTER,
      radiusMiles: RADIUS_MILES,
      minYear: MIN_YEAR,
      disclaimer:
        "Data provided 'as is' and may contain errors or omissions. Historical fire records, not a predictive risk model.",
      retrieved: new Date().toISOString().slice(0, 10),
      count: features.length,
      ...extra,
    },
    features,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const [ca, nv] = [
    await fetchAll("caPerimeters", SOURCES.caPerimeters),
    await fetchAll("nvPerimeters", SOURCES.nvPerimeters),
  ];

  // Newer fires last so they render on top of older ones.
  const perimeters = [...ca, ...nv].sort((a, b) => a.properties.year - b.properties.year);

  const perimPath = join(OUT_DIR, "fire-perimeters.geojson");
  await writeFile(
    perimPath,
    JSON.stringify(
      collection(perimeters, {
        sources: [
          `${SOURCES.caPerimeters.url} (CAL FIRE FRAP, California Historical Fire Perimeters)`,
          `${SOURCES.nvPerimeters.url} (BLM Nevada Fire and Aviation / nevadafireinfo.org)`,
        ],
      })
    )
  );
  console.log(`  -> wrote fire-perimeters.geojson (${perimeters.length} features)`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
