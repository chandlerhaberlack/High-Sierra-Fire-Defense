"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

/* Reno / Tahoe / Truckee / Carson City region (matches scripts/fetch-fire-data.mjs) */
const BOUNDS: [[number, number], [number, number]] = [
  [-120.5, 38.8],
  [-119.0, 40.3],
];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-121.2, 38.3],
  [-118.3, 40.8],
];

const CITIES = [
  { name: "Reno", lngLat: [-119.8138, 39.5296] as [number, number], zoom: 10.5 },
  { name: "Lake Tahoe", lngLat: [-120.0324, 39.0968] as [number, number], zoom: 9.5 },
  { name: "Truckee", lngLat: [-120.1833, 39.328] as [number, number], zoom: 10.5 },
  { name: "Carson City", lngLat: [-119.7674, 39.1638] as [number, number], zoom: 10.5 },
];

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

function popupHtml(title: string, year: unknown, size: string, cause: unknown): string {
  return `<div style="min-width:170px;line-height:1.5">
    <div style="font-weight:600;font-size:13px;color:#f0ebe3">${esc(title) || "Unnamed fire"}</div>
    <div style="font-size:12px;color:#8a8070">${esc(year) || "Year unknown"} &middot; ${esc(size)}</div>
    <div style="font-size:12px;color:#8a8070">Cause: ${esc(cause) || "Unknown"}</div>
  </div>`;
}

/* Warm-tint the OpenFreeMap dark style to match the site palette. */
function tintStyle(map: maplibregl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    try {
      if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-color", "#14110e");
      } else if (layer.type === "fill" && /water/i.test(layer.id)) {
        map.setPaintProperty(layer.id, "fill-color", "#1a2530");
      } else if (layer.type === "fill" && /(land|park|grass|wood|forest)/i.test(layer.id)) {
        map.setPaintProperty(layer.id, "fill-color", "#191510");
      }
    } catch {
      /* layer may not support the property — skip */
    }
  }
}

export function FireMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [showPerimeters, setShowPerimeters] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [counts, setCounts] = useState({ perimeters: 0, points: 0 });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      bounds: BOUNDS,
      fitBoundsOptions: { padding: 24 },
      maxBounds: MAX_BOUNDS,
      minZoom: 7.5,
      attributionControl: { compact: true },
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
        const [perimData, pointData] = await Promise.all([
          fetch("/data/fire-perimeters.geojson").then((r) => r.json()),
          fetch("/data/fire-occurrence.geojson").then((r) => r.json()),
        ]);

        map.addSource("perimeters", { type: "geojson", data: perimData });
        map.addSource("occurrence", { type: "geojson", data: pointData });

        map.addLayer({
          id: "perimeter-fill",
          type: "fill",
          source: "perimeters",
          paint: { "fill-color": "#e85a24", "fill-opacity": 0.26 },
        });
        map.addLayer({
          id: "perimeter-line",
          type: "line",
          source: "perimeters",
          paint: { "line-color": "#ff7a3d", "line-width": 1, "line-opacity": 0.7 },
        });

        /* Glow halo underneath the ignition dots */
        map.addLayer({
          id: "point-glow",
          type: "circle",
          source: "occurrence",
          layout: { visibility: "none" },
          paint: {
            "circle-radius": 7,
            "circle-color": "#e85a24",
            "circle-opacity": 0.18,
            "circle-blur": 1,
          },
        });
        map.addLayer({
          id: "point-dot",
          type: "circle",
          source: "occurrence",
          layout: { visibility: "none" },
          paint: {
            "circle-radius": 3,
            "circle-color": "#f0a23c",
            "circle-opacity": 0.85,
            "circle-stroke-color": "#e85a24",
            "circle-stroke-width": 0.6,
          },
        });

        setCounts({
          perimeters: perimData.features?.length ?? 0,
          points: pointData.features?.length ?? 0,
        });

        const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "260px" });

        map.on("click", "perimeter-fill", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              popupHtml(
                f.properties?.IncidentName,
                f.properties?.Year,
                acres(f.properties?.GISAcres),
                f.properties?.FireCause
              )
            )
            .addTo(map);
        });

        map.on("click", "point-dot", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              popupHtml(
                f.properties?.Fire_Name,
                f.properties?.Year,
                acres(f.properties?.Acres),
                f.properties?.Cause
              )
            )
            .addTo(map);
        });

        for (const id of ["perimeter-fill", "point-dot"]) {
          map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
        }

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
    const vis = showPerimeters ? "visible" : "none";
    for (const id of ["perimeter-fill", "perimeter-line"]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
    }
  }, [showPerimeters, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    const vis = showPoints ? "visible" : "none";
    for (const id of ["point-glow", "point-dot"]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
    }
  }, [showPoints, status]);

  function flyTo(city: (typeof CITIES)[number]) {
    mapRef.current?.flyTo({ center: city.lngLat, zoom: city.zoom, duration: 1600 });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Toggle active={showPerimeters} onClick={() => setShowPerimeters((v) => !v)} swatch="area">
            Burn areas{counts.perimeters ? ` (${counts.perimeters})` : ""}
          </Toggle>
          <Toggle active={showPoints} onClick={() => setShowPoints((v) => !v)} swatch="point">
            Ignition points{counts.points ? ` (${counts.points.toLocaleString()})` : ""}
          </Toggle>
        </div>
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

      <div className="plate-glow relative min-h-[440px] overflow-hidden md:h-[65vh] md:max-h-[680px] md:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paper-2/85 px-6 text-center">
            <p className="text-sm text-ink-muted">
              {status === "loading" ? "Loading four decades of fire history…" : "Map failed to load. Please refresh."}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Historical fire records since 1980 — not a predictive risk model. Source: BLM Nevada Fire
        and Aviation /{" "}
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

function Toggle({
  active,
  onClick,
  swatch,
  children,
}: {
  active: boolean;
  onClick: () => void;
  swatch: "area" | "point";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-medium tracking-wide transition-colors ${
        active
          ? "border-ember bg-ember/15 text-ink"
          : "border-line bg-paper-2 text-ink-muted hover:text-ink"
      }`}
    >
      <span
        aria-hidden
        className={swatch === "area" ? "h-3 w-3 border" : "h-2.5 w-2.5 rounded-full"}
        style={
          swatch === "area"
            ? { backgroundColor: "rgba(232,90,36,0.26)", borderColor: "#ff7a3d" }
            : { backgroundColor: "#f0a23c", outline: "0.6px solid #e85a24" }
        }
      />
      {children}
    </button>
  );
}
