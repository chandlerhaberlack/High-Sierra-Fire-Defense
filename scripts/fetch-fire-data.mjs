// One-time / annual refresh script for the wildfire map data.
//
// Downloads BLM Nevada Fire Info feature services (public) for the
// Reno / Lake Tahoe / Truckee / Northern Nevada region and writes
// generalized GeoJSON into public/data/ so the site can host it itself.
//
// Source: https://www.nevadafireinfo.org/data  (BLM Nevada - Fire and Aviation)
// Data is updated by BLM annually; re-run this script to refresh:
//   node scripts/fetch-fire-data.mjs
//
// Attribution requirement: cite "BLM Nevada Fire and Aviation / Nevada Fire Info"
// and include the "provided as is, no warranty" disclaimer wherever shown.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "data");

// Region bounding box: west, south, east, north (WGS84)
// Covers Reno, Lake Tahoe, Truckee, Carson City and the surrounding WUI.
const BBOX = { xmin: -120.5, ymin: 38.8, xmax: -119.0, ymax: 40.3 };

const BASE = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services";

const SOURCES = {
  perimeters: {
    service: "BLM_NV_Wildland_Fire_Perimeters",
    outFields: ["IncidentName", "GISAcres", "FireCause", "Year"],
    // ~55m simplification keeps polygons crisp at regional zoom while shrinking the file.
    maxAllowableOffset: 0.0005,
    file: "fire-perimeters.geojson",
  },
  occurrence: {
    service: "NV_FireOccurence_1992_to_present",
    outFields: ["Fire_Name", "Acres", "Cause", "Year"],
    maxAllowableOffset: 0,
    file: "fire-occurrence.geojson",
  },
};

const PAGE = 2000; // ArcGIS maxRecordCount per request

function buildUrl(service, { outFields, maxAllowableOffset }, offset) {
  const params = new URLSearchParams({
    where: "1=1",
    geometry: `${BBOX.xmin},${BBOX.ymin},${BBOX.xmax},${BBOX.ymax}`,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: outFields.join(","),
    returnGeometry: "true",
    geometryPrecision: "5",
    f: "geojson",
    resultRecordCount: String(PAGE),
    resultOffset: String(offset),
  });
  if (maxAllowableOffset > 0) {
    params.set("maxAllowableOffset", String(maxAllowableOffset));
  }
  return `${BASE}/${service}/FeatureServer/0/query?${params.toString()}`;
}

async function fetchAll(name, cfg) {
  const features = [];
  let offset = 0;
  for (;;) {
    const url = buildUrl(cfg.service, cfg, offset);
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
  return {
    type: "FeatureCollection",
    metadata: {
      source: `${BASE}/${cfg.service}/FeatureServer/0`,
      attribution: "BLM Nevada Fire and Aviation / Nevada Fire Info (nevadafireinfo.org)",
      disclaimer:
        "Data provided by BLM 'as is' and may contain errors or omissions. Historical fire records, not a predictive risk model.",
      region: "Reno / Lake Tahoe / Truckee / Northern Nevada",
      bbox: BBOX,
      retrieved: new Date().toISOString().slice(0, 10),
      count: features.length,
    },
    features,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const [name, cfg] of Object.entries(SOURCES)) {
    console.log(`Fetching ${name} (${cfg.service})...`);
    const fc = await fetchAll(name, cfg);
    const path = join(OUT_DIR, cfg.file);
    await writeFile(path, JSON.stringify(fc));
    console.log(`  -> wrote ${cfg.file} (${fc.features.length} features)`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
