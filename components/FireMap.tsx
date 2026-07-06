"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

/* ~100-mile radius around Lake Tahoe (matches scripts/fetch-fire-data.mjs) */
const BOUNDS: [[number, number], [number, number]] = [
  [-121.6, 38.2],
  [-118.9, 40.2],
];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-122.6, 37.3],
  [-117.6, 41.0],
];

const CITIES = [
  { name: "Lake Tahoe", lngLat: [-120.0324, 39.0968] as [number, number], zoom: 9.5 },
  { name: "Reno", lngLat: [-119.8138, 39.5296] as [number, number], zoom: 10.5 },
  { name: "Truckee", lngLat: [-120.1833, 39.328] as [number, number], zoom: 10.5 },
  { name: "Carson City", lngLat: [-119.7674, 39.1638] as [number, number], zoom: 10.5 },
  { name: "Placerville", lngLat: [-120.7983, 38.7296] as [number, number], zoom: 10 },
];

/* Year color ramp (magma-like): older fires cool and dark, recent fires hot and bright. */
const YEAR_STOPS: [number, string][] = [
  [1950, "#51127c"],
  [1965, "#822681"],
  [1980, "#b5367a"],
  [1995, "#e55064"],
  [2010, "#fb8861"],
  [2025, "#fcfdbf"],
];
const YEAR_MIN = YEAR_STOPS[0][0];
const YEAR_MAX = YEAR_STOPS[YEAR_STOPS.length - 1][0];

const YEAR_GRADIENT_CSS = `linear-gradient(90deg, ${YEAR_STOPS.map(
  ([y, c]) => `${c} ${((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100}%`
).join(", ")})`;

const yearColorExpr: maplibregl.ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["to-number", ["get", "year"], YEAR_MIN],
  ...YEAR_STOPS.flat(),
] as unknown as maplibregl.ExpressionSpecification;

function yearFilter(range: [number, number]): maplibregl.ExpressionSpecification {
  return [
    "all",
    [">=", ["to-number", ["get", "year"], 0], range[0]],
    ["<=", ["to-number", ["get", "year"], 0], range[1]],
  ] as unknown as maplibregl.ExpressionSpecification;
}

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function acres(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "Size unknown";
  return `${Math.round(n).toLocaleString()} acres`;
}

function popupHtml(p: Record<string, unknown> | undefined): string {
  return `<div style="min-width:170px;line-height:1.5">
    <div style="font-weight:600;font-size:13px;color:#f0ebe3">${esc(p?.name) || "Unnamed fire"}</div>
    <div style="font-size:12px;color:#8a8070">${esc(p?.year) || "Year unknown"} &middot; ${esc(acres(p?.acres))}</div>
    <div style="font-size:12px;color:#8a8070">Cause: ${esc(p?.cause) || "Unknown"}</div>
    <div style="font-size:11px;color:#8a8070;opacity:0.8">Source: ${esc(p?.src) || "Unknown"}</div>
  </div>`;
}

/* Warm-tint the OpenFreeMap dark style to match the site palette. */
function tintStyle(map: maplibregl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    try {
      if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-color", "#1e1915");
      } else if (layer.type === "fill" && /water/i.test(layer.id)) {
        map.setPaintProperty(layer.id, "fill-color", "#243342");
      } else if (layer.type === "fill" && /(land|park|grass|wood|forest)/i.test(layer.id)) {
        map.setPaintProperty(layer.id, "fill-color", "#241e17");
      }
    } catch {
      /* layer may not support the property — skip */
    }
  }
}

export function FireMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  /* Feature years kept for cheap count recomputation when the filter moves. */
  const yearsRef = useRef<number[]>([]);

  const [yearRange, setYearRange] = useState<[number, number]>([YEAR_MIN, YEAR_MAX]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      bounds: BOUNDS,
      fitBoundsOptions: { padding: 24 },
      maxBounds: MAX_BOUNDS,
      minZoom: 6,
      attributionControl: { compact: true },
      /* One-finger swipe scrolls the page; two fingers pan the map. */
      cooperativeGestures: true,
    });
    mapRef.current = map;

    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __emberxMap?: maplibregl.Map }).__emberxMap = map;
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.touchZoomRotate.disableRotation();
    map.dragRotate.disable();

    map.on("error", () => setStatus((s) => (s === "ready" ? s : "error")));

    map.on("load", async () => {
      tintStyle(map);

      try {
        const perimData = await fetch("/data/fire-perimeters.geojson").then((r) => r.json());

        map.addSource("perimeters", { type: "geojson", data: perimData });

        const initialFilter = yearFilter([YEAR_MIN, YEAR_MAX]);

        map.addLayer({
          id: "perimeter-fill",
          type: "fill",
          source: "perimeters",
          filter: initialFilter,
          paint: { "fill-color": yearColorExpr, "fill-opacity": 0.34 },
        });
        map.addLayer({
          id: "perimeter-line",
          type: "line",
          source: "perimeters",
          filter: initialFilter,
          paint: { "line-color": yearColorExpr, "line-width": 0.8, "line-opacity": 0.85 },
        });

        type Feature = { properties?: { year?: unknown } };
        yearsRef.current = ((perimData.features ?? []) as Feature[])
          .map((f) => Number(f.properties?.year))
          .filter((y) => Number.isFinite(y));
        /* Trigger a counts recompute now that years are known. */
        setYearRange((r) => [...r] as [number, number]);

        const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "260px" });

        map.on("click", "perimeter-fill", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          popup.setLngLat(e.lngLat).setHTML(popupHtml(f.properties)).addTo(map);
        });

        map.on("mouseenter", "perimeter-fill", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "perimeter-fill", () => (map.getCanvas().style.cursor = ""));

        setStatus("ready");
      } catch {
        setStatus("error");
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    const filter = yearFilter(yearRange);
    for (const id of ["perimeter-fill", "perimeter-line"]) {
      if (map.getLayer(id)) map.setFilter(id, filter);
    }
  }, [yearRange, status]);

  const count = useMemo(
    () => yearsRef.current.filter((y) => y >= yearRange[0] && y <= yearRange[1]).length,
    /* status dep: years arrive when the map finishes loading */
    [yearRange, status] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function flyTo(city: (typeof CITIES)[number]) {
    mapRef.current?.flyTo({ center: city.lngLat, zoom: city.zoom, duration: 1600 });
  }

  function setMinYear(v: number) {
    setYearRange(([, max]) => [Math.min(v, max), max]);
  }
  function setMaxYear(v: number) {
    setYearRange(([min]) => [min, Math.max(v, min)]);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 border border-ember bg-ember/15 px-3 py-1.5 text-xs font-medium tracking-wide text-ink">
          <span
            aria-hidden
            className="h-3 w-3 border border-line"
            style={{ background: YEAR_GRADIENT_CSS, opacity: 0.9 }}
          />
          Burn areas{count ? ` (${count.toLocaleString()})` : ""}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => flyTo(c)}
              className="border border-line bg-paper-2 px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-ember/50 hover:text-ink"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year range filter — the track doubles as the old-to-new color legend. */}
      <div className="mb-3 border border-line bg-paper-2 px-4 py-3">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-medium tracking-wide text-ink-muted">
            Fires from{" "}
            <span className="font-semibold text-ink">
              {yearRange[0]} – {yearRange[1]}
            </span>
          </span>
          {(yearRange[0] !== YEAR_MIN || yearRange[1] !== YEAR_MAX) && (
            <button
              type="button"
              onClick={() => setYearRange([YEAR_MIN, YEAR_MAX])}
              className="text-xs text-ink-muted underline transition-colors hover:text-ember"
            >
              Reset
            </button>
          )}
        </div>
        <div className="relative h-5">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full opacity-90"
            style={{ background: YEAR_GRADIENT_CSS }}
          />
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={yearRange[0]}
            onChange={(e) => setMinYear(Number(e.target.value))}
            aria-label="Earliest fire year"
            className="year-slider"
          />
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={yearRange[1]}
            onChange={(e) => setMaxYear(Number(e.target.value))}
            aria-label="Latest fire year"
            className="year-slider"
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-muted">
          <span>{YEAR_MIN} · older</span>
          <span>newer · {YEAR_MAX}</span>
        </div>
      </div>

      {/* Explicit height at every breakpoint: maplibre forces the container to
          position:relative, so its h-full needs a resolvable parent height. */}
      <div className="plate-glow relative h-[440px] overflow-hidden md:h-[65vh] md:max-h-[680px] md:min-h-[540px]">
        <div ref={containerRef} className="h-full w-full" />

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paper-2/85 px-6 text-center">
            <p className="text-sm text-ink-muted">
              {status === "loading" ? "Loading seven decades of fire history…" : "Map failed to load. Please refresh."}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Historical fire records since {YEAR_MIN} within roughly 100 miles of Lake Tahoe — not a
        predictive risk model. Sources:{" "}
        <a
          href="https://www.fire.ca.gov/what-we-do/fire-resource-assessment-program"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-ember"
        >
          CAL FIRE FRAP
        </a>{" "}
        and BLM Nevada Fire and Aviation /{" "}
        <a
          href="https://www.nevadafireinfo.org/data"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-ember"
        >
          Nevada Fire Info
        </a>
        . Data provided &ldquo;as is&rdquo; with no warranty.
      </p>
    </div>
  );
}
