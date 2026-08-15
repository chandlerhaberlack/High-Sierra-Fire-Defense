"use client";

import { motion } from "motion/react";
import type { ComponentId, SimSnapshot } from "./data";
import { COMPONENTS } from "./data";
import {
  INK, MUTED, LINE, SURF, SURF2, EMBER, EMBER_GLOW,
  RETARDANT, RETARDANT_GLOW, OK, OK_GLOW, LV3, LV3_GLOW,
} from "./palette";

type Dir = "N" | "E" | "S" | "W";
const DIRS: Dir[] = ["N", "E", "S", "W"];

/* Zone rectangles between the house and the property line (viewBox 0 0 460 440) */
const ZONES: Record<Dir, { x: number; y: number; w: number; h: number; lx: number; ly: number }> = {
  N: { x: 160, y: 72, w: 140, h: 66, lx: 230, ly: 108 },
  S: { x: 160, y: 302, w: 140, h: 66, lx: 230, ly: 340 },
  W: { x: 82, y: 150, w: 66, h: 140, lx: 115, ly: 224 },
  E: { x: 312, y: 150, w: 66, h: 140, lx: 345, ly: 224 },
};

/* Sprinkler heads along each house wall */
const SPRINKLERS: Record<Dir, { x: number; y: number }[]> = {
  N: [176, 212, 248, 284].map((x) => ({ x, y: 150 })),
  S: [176, 212, 248, 284].map((x) => ({ x, y: 290 })),
  W: [166, 202, 238, 274].map((y) => ({ x: 160, y })),
  E: [166, 202, 238, 274].map((y) => ({ x: 300, y })),
};

const SPRAY: Record<Dir, { dx: number; dy: number }[]> = {
  N: [{ dx: -8, dy: -16 }, { dx: 0, dy: -19 }, { dx: 8, dy: -16 }],
  S: [{ dx: -8, dy: 16 }, { dx: 0, dy: 19 }, { dx: 8, dy: 16 }],
  W: [{ dx: -16, dy: -8 }, { dx: -19, dy: 0 }, { dx: -16, dy: 8 }],
  E: [{ dx: 16, dy: -8 }, { dx: 19, dy: 0 }, { dx: 16, dy: 8 }],
};

/* The 8 perimeter thermal nodes sit on the melt-wire loop (the property line). */
const NODE_POSITIONS = [
  { x: 40, y: 30 }, { x: 230, y: 30 }, { x: 420, y: 30 }, { x: 420, y: 220 },
  { x: 420, y: 410 }, { x: 230, y: 410 }, { x: 40, y: 410 }, { x: 40, y: 220 },
];

interface Props {
  snap: SimSnapshot;
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
}

export function PropertyView({ snap, selected, onSelect }: Props) {
  const { tripped, deployed, camerasOn, fireProgress } = snap;
  const nodesTripped = tripped.has("nodes");
  const airTripped = tripped.has("air");
  const camsTripped = tripped.has("cameras");

  const related = new Set<ComponentId>(selected ? COMPONENTS[selected].connects : []);
  const emphasis = (id: ComponentId): "selected" | "related" | "none" =>
    selected === id ? "selected" : related.has(id) ? "related" : "none";

  /* Selection ring helpers */
  const ringStroke = (id: ComponentId) =>
    emphasis(id) === "selected" ? OK_GLOW : emphasis(id) === "related" ? OK : "transparent";
  const ringDash = (id: ComponentId) => (emphasis(id) === "related" ? "4 3" : undefined);

  const clickable = (id: ComponentId) => ({
    role: "button" as const,
    tabIndex: 0,
    style: { cursor: "pointer" as const },
    "aria-label": `${COMPONENTS[id].name} — tap to learn more`,
    onClick: () => onSelect(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(id);
      }
    },
  });

  const label = `Property top view: eight thermal nodes on the melt-wire property loop, thermal cameras ${
    camerasOn ? "on" : "sleeping"
  }, ${deployed ? "retardant deploying in all four zones" : "four sprinkler zones ready"}.`;

  return (
    <div className="plate-glow relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ember">
          Your Property — Top View
        </span>
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
          <span className="status-dot" aria-hidden />
          {deployed ? "Deploying · 4 zones" : "Watching · every part is tappable"}
        </span>
      </div>

      <svg viewBox="0 0 460 440" className="w-full" role="img" aria-label={label}>
        <rect width="460" height="440" fill={SURF} />

        {/* Fire glow bleeding in from the northeast as it approaches */}
        <defs>
          <linearGradient id="pv-fire" x1="1" y1="0" x2="0.25" y2="0.75">
            <stop offset="0%" stopColor={EMBER} stopOpacity="0.4" />
            <stop offset="45%" stopColor={EMBER} stopOpacity="0" />
          </linearGradient>
          <marker id="pv-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L8,3.5 z" fill={EMBER} />
          </marker>
        </defs>
        <motion.rect
          width="460" height="440" fill="url(#pv-fire)"
          initial={false}
          animate={{ opacity: fireProgress }}
          transition={{ duration: 1 }}
        />
        {fireProgress > 0.4 && (
          <g>
            <motion.line
              x1="446" y1="14" x2="414" y2="42"
              stroke={EMBER} strokeWidth="3" markerEnd="url(#pv-arrow)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
            <text x="404" y="16" textAnchor="end" fill={EMBER} fontSize="9" fontFamily="monospace" fontWeight="700" letterSpacing="1.5">
              FIRE
            </text>
          </g>
        )}

        {/* ── Melt-wire loop + 8 perimeter nodes ── */}
        <g {...clickable("nodes")}>
          {/* generous invisible hit area along the loop */}
          <rect x="28" y="18" width="404" height="404" fill="none" stroke="transparent" strokeWidth="24" pointerEvents="stroke" />
          <motion.rect
            x="40" y="30" width="380" height="380" fill="none"
            strokeDasharray="7 5"
            initial={false}
            animate={{ stroke: nodesTripped ? LV3 : emphasis("nodes") !== "none" ? OK : MUTED, strokeWidth: emphasis("nodes") === "selected" ? 2 : 1.2 }}
            transition={{ duration: 0.4 }}
          />
          {NODE_POSITIONS.map((n, i) => {
            /* When the melt-wire trips it's node 3 (NE corner) that severs first */
            const hot = nodesTripped && (i === 2 || i === 3);
            return (
              <g key={i}>
                {hot && (
                  <circle cx={n.x} cy={n.y} r="10" fill="none" stroke={LV3_GLOW} strokeWidth="1">
                    <animate attributeName="r" values="6;13;6" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={n.x} cy={n.y} r="4.5"
                  fill={hot ? LV3 : SURF2}
                  stroke={hot ? LV3_GLOW : nodesTripped ? LV3 : ringStroke("nodes") !== "transparent" ? ringStroke("nodes") : MUTED}
                  strokeWidth="1.3"
                />
              </g>
            );
          })}
          <text x="52" y="424" fill={nodesTripped ? LV3 : MUTED} fontSize="8" fontFamily="monospace" letterSpacing="1">
            8× THERMAL NODES · MELT-WIRE LOOP {nodesTripped ? "· SEVERED" : ""}
          </text>
          {/* Wire lead from the loop into the brain */}
          <line x1="230" y1="30" x2="230" y2="150" stroke={nodesTripped ? LV3 : LINE} strokeWidth="1" className={nodesTripped ? "flow-line" : undefined} opacity="0.8" />
        </g>

        {/* ── Sprinkler zones ── */}
        <g {...clickable("zones")}>
          {DIRS.map((z) => {
            const r = ZONES[z];
            return (
              <g key={z}>
                <motion.rect
                  x={r.x} y={r.y} width={r.w} height={r.h}
                  fill={deployed ? RETARDANT : "none"}
                  initial={false}
                  animate={{
                    fillOpacity: deployed ? [0.08, 0.18, 0.08] : 0,
                    stroke: deployed ? RETARDANT : ringStroke("zones") !== "transparent" ? ringStroke("zones") : MUTED,
                    strokeWidth: deployed || emphasis("zones") === "selected" ? 1.8 : 1,
                  }}
                  strokeDasharray={deployed ? undefined : ringDash("zones") ?? "4 4"}
                  transition={deployed ? { fillOpacity: { repeat: Infinity, duration: 2.2 }, duration: 0.4 } : { duration: 0.4 }}
                />
                <text x={r.lx} y={r.ly - 5} textAnchor="middle" fill={deployed ? RETARDANT_GLOW : MUTED} fontSize="12" fontFamily="monospace" fontWeight="700">
                  {z}
                </text>
                <text x={r.lx} y={r.ly + 8} textAnchor="middle" fill={deployed ? RETARDANT : MUTED} fontSize="6.5" fontFamily="monospace" letterSpacing="1">
                  {deployed ? "DEPLOYING" : "ZONE READY"}
                </text>
                {SPRINKLERS[z].map((s, i) => (
                  <g key={i}>
                    <circle cx={s.x} cy={s.y} r={3} fill={deployed ? RETARDANT : SURF2} stroke={deployed ? RETARDANT_GLOW : MUTED} strokeWidth="1" />
                    {deployed &&
                      SPRAY[z].map((sp, j) => (
                        <motion.line
                          key={j}
                          x1={s.x} y1={s.y} x2={s.x + sp.dx} y2={s.y + sp.dy}
                          stroke={RETARDANT_GLOW} strokeWidth="1.3"
                          animate={{ opacity: [0.2, 0.9, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1.1, delay: (i * 3 + j) * 0.1 }}
                        />
                      ))}
                  </g>
                ))}
              </g>
            );
          })}
        </g>

        {/* ── House + brain + air sensor ── */}
        <rect x="160" y="150" width="140" height="140" fill={SURF2} stroke={INK} strokeWidth="1.5" />
        <text x="230" y="172" textAnchor="middle" fill={MUTED} fontSize="8" fontFamily="monospace" letterSpacing="1.5">HOME</text>

        {/* Central computer inside the house */}
        <g {...clickable("brain")}>
          <motion.rect
            x="180" y="196" width="100" height="48" fill={SURF}
            initial={false}
            animate={{
              stroke: emphasis("brain") === "selected" ? OK_GLOW : deployed ? EMBER_GLOW : EMBER,
              strokeWidth: emphasis("brain") === "selected" ? 2 : 1.6,
            }}
            strokeDasharray={ringDash("brain")}
            transition={{ duration: 0.3 }}
          />
          <text x="230" y="215" textAnchor="middle" fill={EMBER} fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">CENTRAL COMPUTER</text>
          <text x="230" y="228" textAnchor="middle" fill={MUTED} fontSize="6" fontFamily="monospace">Pi · GPS · SMS text</text>
          <circle cx="188" cy="204" r="2.5" fill={EMBER_GLOW}>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Ambient air sensor on the house eave */}
        <g {...clickable("air")}>
          <circle cx="286" cy="160" r="12" fill="transparent" />
          <circle cx="286" cy="160" r="5" fill={airTripped ? LV3 : SURF} stroke={airTripped ? LV3_GLOW : ringStroke("air") !== "transparent" ? ringStroke("air") : INK} strokeWidth="1.3" />
          {[0, 1].map((i) => (
            <path
              key={i}
              d={`M ${292 + i * 4} ${154 - i * 3} q 4 6 0 12`}
              fill="none"
              stroke={airTripped ? LV3_GLOW : MUTED}
              strokeWidth="1"
              opacity={airTripped ? 1 : 0.6}
            >
              {airTripped && <animate attributeName="opacity" values="1;0.2;1" dur="1s" begin={`${i * 0.3}s`} repeatCount="indefinite" />}
            </path>
          ))}
          <text x="286" y="146" textAnchor="middle" fill={airTripped ? LV3 : MUTED} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">
            {airTripped ? "AIR +9°F/MIN" : "AIR SENSOR"}
          </text>
        </g>

        {/* ── Thermal cameras: CAM 1 (NE) sweeps the east half, CAM 2 (SW) the west half ── */}
        <g {...clickable("cameras")}>
          {[
            { x: 390, y: 62, from: -90, to: 90, lx: 390, ly: 88, anchor: "middle" as const },
            { x: 70, y: 306, from: 90, to: 270, lx: 86, ly: 309, anchor: "start" as const },
          ].map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="14" fill="transparent" />
              {camerasOn && (
                <g>
                  {/* Sweep wedge pivots exactly on the camera (the wedge tip). */}
                  <path
                    d={`M ${c.x} ${c.y} L ${c.x + 26} ${c.y - 12} A 29 29 0 0 1 ${c.x + 26} ${c.y + 12} Z`}
                    fill={camsTripped ? LV3 : OK}
                    opacity="0.18"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`${c.from} ${c.x} ${c.y}; ${c.to} ${c.x} ${c.y}; ${c.from} ${c.x} ${c.y}`}
                      keyTimes="0; 0.5; 1"
                      calcMode="spline"
                      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* 180° coverage arc */}
                  <path
                    d={
                      i === 0
                        ? `M ${c.x} ${c.y - 13} A 13 13 0 0 1 ${c.x} ${c.y + 13}`
                        : `M ${c.x} ${c.y + 13} A 13 13 0 0 1 ${c.x} ${c.y - 13}`
                    }
                    fill="none"
                    stroke={camsTripped ? LV3 : OK}
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                    opacity="0.6"
                  />
                </g>
              )}
              <rect
                x={c.x - 5} y={c.y - 5} width="10" height="10"
                fill={camerasOn ? (camsTripped ? LV3 : SURF2) : SURF2}
                stroke={camsTripped ? LV3_GLOW : camerasOn ? OK : ringStroke("cameras") !== "transparent" ? ringStroke("cameras") : MUTED}
                strokeWidth="1.3"
                opacity={camerasOn ? 1 : 0.7}
              />
              <circle cx={c.x} cy={c.y} r="2" fill={camerasOn ? (camsTripped ? LV3_GLOW : OK_GLOW) : MUTED} />
              <text x={c.lx} y={c.ly} textAnchor={c.anchor} fill={camsTripped ? LV3 : camerasOn ? OK : MUTED} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">
                {camerasOn ? (camsTripped && i === 0 ? "CAM 1 · HEAT" : `CAM ${i + 1} · 180°`) : `CAM ${i + 1} · OFF`}
              </text>
            </g>
          ))}
        </g>

        {/* ── Retardant tank + pump (bottom-left corner of the yard) ── */}
        <g {...clickable("tank")}>
          <motion.rect
            x="52" y="334" width="58" height="44" fill={SURF2}
            initial={false}
            animate={{ stroke: emphasis("tank") === "selected" ? OK_GLOW : RETARDANT, strokeWidth: emphasis("tank") === "selected" ? 2 : 1.3 }}
            strokeDasharray={ringDash("tank")}
          />
          {/* fill level */}
          <motion.rect
            x="53.5" y={deployed ? 348 : 341} width="55"
            initial={false}
            animate={{ height: deployed ? 29 : 36 }}
            fill={RETARDANT} opacity="0.18"
          />
          <text x="81" y="352" textAnchor="middle" fill={RETARDANT} fontSize="7" fontFamily="monospace" fontWeight="700">RETARDANT</text>
          <text x="81" y="363" textAnchor="middle" fill={MUTED} fontSize="6" fontFamily="monospace">{deployed ? "74%" : "100%"} · bio-safe</text>
        </g>
        <g {...clickable("pump")}>
          <motion.rect
            x="118" y="342" width="40" height="30" fill={SURF2}
            initial={false}
            animate={{ stroke: emphasis("pump") === "selected" ? OK_GLOW : deployed ? RETARDANT_GLOW : LINE, strokeWidth: deployed || emphasis("pump") === "selected" ? 1.8 : 1.1 }}
            strokeDasharray={ringDash("pump")}
          />
          <text x="138" y="355" textAnchor="middle" fill={deployed ? RETARDANT_GLOW : INK} fontSize="6.5" fontFamily="monospace" fontWeight="700">PUMP</text>
          <text x="138" y="365" textAnchor="middle" fill={MUTED} fontSize="5.5" fontFamily="monospace">{deployed ? "RUNNING" : "READY"}</text>
        </g>
        {/* tank → pump → zone lines */}
        <line x1="110" y1="357" x2="118" y2="357" stroke={deployed ? RETARDANT : LINE} strokeWidth={deployed ? 2 : 1} className={deployed ? "flow-line" : undefined} />
        <path d="M158 357 H 186 V 290" fill="none" stroke={deployed ? RETARDANT : LINE} strokeWidth={deployed ? 2 : 1} className={deployed ? "flow-line" : undefined} />

        {/* ── Independent power (bottom-right corner) ── */}
        <g {...clickable("power")}>
          <motion.rect
            x="348" y="334" width="64" height="44" fill={SURF2}
            initial={false}
            animate={{ stroke: emphasis("power") === "selected" ? OK_GLOW : snap.gridPower ? LINE : OK, strokeWidth: emphasis("power") === "selected" ? 2 : 1.2 }}
            strokeDasharray={ringDash("power")}
          />
          {/* solar panel glyph */}
          <g stroke={snap.gridPower ? MUTED : OK_GLOW} strokeWidth="0.9" fill="none">
            <rect x="358" y="341" width="18" height="11" />
            <line x1="364" y1="341" x2="364" y2="352" />
            <line x1="370" y1="341" x2="370" y2="352" />
            <line x1="358" y1="346.5" x2="376" y2="346.5" />
          </g>
          <text x="402" y="350" textAnchor="end" fill={snap.gridPower ? MUTED : OK} fontSize="6.5" fontFamily="monospace" fontWeight="700">
            {snap.gridPower ? "GRID ✓" : "SOLAR"}
          </text>
          <text x="380" y="368" textAnchor="middle" fill={MUTED} fontSize="5.5" fontFamily="monospace">
            {snap.gridPower ? "solar standby" : "low power"}
          </text>
        </g>
        <path d="M348 356 H 322 V 290" fill="none" stroke={LINE} strokeWidth="1" opacity="0.7" />
      </svg>
    </div>
  );
}
