"use client";

import { motion } from "motion/react";
import type { EvacStatus, SimSnapshot } from "./data";
import { EVAC_LABEL } from "./data";
import { INK, MUTED, LINE, SURF, SURF2, EMBER, EMBER_GLOW, EVAC_COLOR } from "./palette";

const EVAC_OPTIONS: EvacStatus[] = ["none", "ready", "set", "go"];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The burn scar grows from a fixed origin in the NE toward the home pin —
 * like a real burn map, everything already burned stays highlighted.
 */
function burnPath(p: number): string {
  const pts: [number, number][] = [
    [334, 2],                                  // fixed origin, top edge
    [342, 46],                                 // fixed origin, right edge
    [lerp(330, 226, p), lerp(58, 118, p)],     // south flank
    [lerp(318, 128, p), lerp(44, 94, p)],      // leading edge → reaches the pin
    [lerp(316, 168, p), lerp(20, 34, p)],      // north flank
  ];
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
}

interface Props {
  snap: SimSnapshot;
  /** Explore mode: let the user pick the WatchDuty evacuation status. */
  onSelectEvac?: (evac: EvacStatus) => void;
}

export function WatchDutyMap({ snap, onSelectEvac }: Props) {
  const { evac, redFlag, fireProgress } = snap;
  const zoneColor = EVAC_COLOR[evac];
  const hasFire = fireProgress > 0;

  /* Leading edge of the fire front, for the marker + label */
  const fx = lerp(318, 128, fireProgress);
  const fy = lerp(44, 94, fireProgress);

  return (
    <div className="plate overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">
          WatchDuty · Evac Status
        </span>
        <span className="flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-wider">
          {redFlag && <span className="text-ember">⚑ Red Flag</span>}
          <span style={{ color: zoneColor }}>{EVAC_LABEL[evac]}</span>
        </span>
      </div>

      <svg viewBox="0 0 340 132" className="w-full" role="img"
        aria-label={`WatchDuty map: evacuation status ${EVAC_LABEL[evac]}${hasFire ? ", burn area spreading from the northeast" : ", no active fire nearby"}.`}>
        <rect width="340" height="132" fill={SURF} />

        {/* Terrain contours */}
        <g fill="none" stroke={LINE} strokeWidth="0.7" opacity="0.6">
          <path d="M-10 40 C 60 20, 130 60, 200 38 S 320 50, 360 30" />
          <path d="M-10 70 C 70 50, 140 92, 210 68 S 320 82, 360 60" />
          <path d="M-10 100 C 80 82, 150 122, 220 98 S 320 112, 360 92" />
        </g>
        <path d="M-10 126 C 90 112, 200 128, 350 118" fill="none" stroke={MUTED} strokeWidth="0.7" opacity="0.4" />

        {/* Evacuation zone around the home */}
        <motion.path
          d="M40 30 L 196 42 L 208 116 L 52 124 Z"
          animate={{ fill: zoneColor, fillOpacity: evac === "none" ? 0.05 : 0.16, stroke: zoneColor, strokeOpacity: evac === "none" ? 0.3 : 0.8 }}
          transition={{ duration: 0.8 }}
          strokeWidth="1"
          strokeDasharray="5 3"
        />
        <text x="52" y="42" fill={zoneColor} fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="1" opacity={evac === "none" ? 0.5 : 1}>
          {`ZONE: ${EVAC_LABEL[evac]}`}
        </text>

        {/* Burn scar: grows from the NE, burned ground stays highlighted */}
        {hasFire && (
          <g>
            <motion.path
              initial={false}
              animate={{ d: burnPath(fireProgress) }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              fill={EMBER}
              fillOpacity="0.3"
              stroke={EMBER}
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            {/* charred core near the origin */}
            <motion.path
              initial={false}
              animate={{ d: burnPath(Math.max(0, fireProgress - 0.3)) }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              fill="#170a04"
              fillOpacity="0.85"
            />
            {/* active fire front on the leading edge */}
            <motion.g initial={false} animate={{ x: fx, y: fy }} transition={{ duration: 0.9, ease: "easeOut" }}>
              <circle r="3.5" fill={EMBER_GLOW}>
                <animate attributeName="opacity" values="1;0.4;1" dur="1.3s" repeatCount="indefinite" />
              </circle>
              <circle r="7" fill="none" stroke={EMBER_GLOW} strokeWidth="0.8" opacity="0.5">
                <animate attributeName="r" values="5;9;5" dur="1.3s" repeatCount="indefinite" />
              </circle>
              <text x="11" y="-10" textAnchor="start" fill={EMBER_GLOW} fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="1">FIRE</text>
            </motion.g>
          </g>
        )}

        {/* Home GPS pin */}
        <g transform="translate(120, 86)">
          <circle r="10" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.5">
            <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M0 -10 C 5 -10, 8 -6, 8 -2 C 8 3, 0 10, 0 10 C 0 10, -8 3, -8 -2 C -8 -6, -5 -10, 0 -10 Z" fill={SURF2} stroke={INK} strokeWidth="1.2" />
          <circle cy="-2" r="2.4" fill={INK} />
          <text y="22" textAnchor="middle" fill={MUTED} fontSize="7" fontFamily="monospace" letterSpacing="1">YOUR HOME · GPS</text>
        </g>
      </svg>

      {/* Evacuation status chooser */}
      <div className="flex items-center gap-1.5 border-t border-line px-3 py-2">
        <span className="mr-1 font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted">
          {onSelectEvac ? "WatchDuty calls it:" : "WatchDuty feed:"}
        </span>
        <div className="flex flex-1 gap-1" role="group" aria-label="WatchDuty evacuation status">
          {EVAC_OPTIONS.map((e) => {
            const active = evac === e;
            const color = EVAC_COLOR[e];
            return (
              <button
                key={e}
                type="button"
                disabled={!onSelectEvac}
                onClick={() => onSelectEvac?.(e)}
                aria-pressed={active}
                className={`flex-1 border px-1 py-1.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider transition-all ${
                  active ? "" : "border-line bg-paper-3 text-ink-muted"
                } ${onSelectEvac && !active ? "hover:text-ink hover:border-ink-muted" : ""} ${!onSelectEvac && !active ? "opacity-50" : ""}`}
                style={active ? { borderColor: color, color, backgroundColor: `${color}1f` } : undefined}
              >
                {EVAC_LABEL[e]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
