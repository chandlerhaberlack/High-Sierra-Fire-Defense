/* Palette constants mirrored from globals.css for use inside SVG/canvas. */
export const INK = "#f0ebe3";
export const MUTED = "#8a8070";
export const LINE = "#3a3228";
export const SURF = "#1c1814";
export const SURF2 = "#252019";
export const EMBER = "#e85a24";
export const EMBER_GLOW = "#ff7a3d";
/* Retardant reads as the amber "pulse" tone — distinct from fire ember. */
export const RETARDANT = "#f0a23c";
export const RETARDANT_GLOW = "#ffc06a";
/* Cool blue now means "healthy / online" rather than water. */
export const OK = "#6fa8c9";
export const OK_GLOW = "#9cc6de";

/* Readiness-level colors: green = standby, yellow = armed, red = critical.
   Sensor detections also read as red — distinct from the ember fire tone. */
export const LV1 = "#7ea87a";
export const LV2 = "#d9b23c";
export const LV3 = "#d94f4f";
export const LV3_GLOW = "#ff7070";
export const LEVEL_COLOR: Record<1 | 2 | 3, string> = { 1: LV1, 2: LV2, 3: LV3 };

/* WatchDuty evacuation statuses, escalating green → yellow → orange → red. */
export const EVAC_COLOR: Record<"none" | "ready" | "set" | "go", string> = {
  none: LV1,
  ready: LV2,
  set: "#e88a24",
  go: LV3,
};
