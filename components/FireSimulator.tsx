"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Direction = "N" | "E" | "S" | "W";
type Phase = "city" | "lost" | "reservoir";

const DIRECTIONS: Direction[] = ["N", "E", "S", "W"];
const OPPOSITE: Record<Direction, Direction> = { N: "S", S: "N", E: "W", W: "E" };
const DIR_LABEL: Record<Direction, string> = {
  N: "North",
  E: "East",
  S: "South",
  W: "West",
};

/* Palette constants mirrored from globals.css */
const INK = "#f0ebe3";
const MUTED = "#8a8070";
const LINE = "#3a3228";
const SURF = "#1c1814";
const SURF2 = "#252019";
const EMBER = "#e85a24";
const EMBER_GLOW = "#ff7a3d";
const WATER = "#6fa8c9";

function zoneState(zone: Direction, fire: Direction): "active" | "assist" | "standby" {
  if (zone === fire) return "active";
  if (zone === OPPOSITE[fire]) return "standby";
  return "assist";
}

/* Zone rectangles around the house (viewBox 0 0 420 420) */
const ZONES: Record<Direction, { x: number; y: number; w: number; h: number; lx: number; ly: number }> = {
  N: { x: 140, y: 62, w: 140, h: 66, lx: 210, ly: 100 },
  S: { x: 140, y: 292, w: 140, h: 66, lx: 210, ly: 330 },
  W: { x: 62, y: 140, w: 66, h: 140, lx: 95, ly: 214 },
  E: { x: 292, y: 140, w: 66, h: 140, lx: 325, ly: 214 },
};

/* Fire front arrow geometry per direction */
const FIRE_ARROWS: Record<Direction, { x1: number; y1: number; x2: number; y2: number; tx: number; ty: number }> = {
  N: { x1: 210, y1: 8, x2: 210, y2: 48, tx: 178, ty: 32 },
  S: { x1: 210, y1: 412, x2: 210, y2: 372, tx: 178, ty: 394 },
  W: { x1: 8, y1: 210, x2: 48, y2: 210, tx: 28, ty: 198 },
  E: { x1: 412, y1: 210, x2: 372, y2: 210, tx: 392, ty: 198 },
};

/* Sprinkler positions along the house wall facing each zone */
const SPRINKLERS: Record<Direction, { x: number; y: number }[]> = {
  N: [156, 192, 228, 264].map((x) => ({ x, y: 140 })),
  S: [156, 192, 228, 264].map((x) => ({ x, y: 280 })),
  W: [156, 192, 228, 264].map((y) => ({ x: 140, y })),
  E: [156, 192, 228, 264].map((y) => ({ x: 280, y })),
};

/* Spray line offsets (fan outward from the wall into the zone) */
const SPRAY: Record<Direction, { dx: number; dy: number }[]> = {
  N: [{ dx: -8, dy: -16 }, { dx: 0, dy: -19 }, { dx: 8, dy: -16 }],
  S: [{ dx: -8, dy: 16 }, { dx: 0, dy: 19 }, { dx: 8, dy: 16 }],
  W: [{ dx: -16, dy: -8 }, { dx: -19, dy: 0 }, { dx: -16, dy: 8 }],
  E: [{ dx: 16, dy: -8 }, { dx: 19, dy: 0 }, { dx: 16, dy: 8 }],
};

const PHASE_DURATION: Record<Phase, number> = { city: 6000, lost: 2200, reservoir: 9000 };

export function FireSimulator() {
  const reduced = useReducedMotion();
  const [fire, setFire] = useState<Direction>("W");
  const [auto, setAuto] = useState(false);
  const [phaseState, setPhase] = useState<Phase>("city");
  const [reservoirPct, setReservoirPct] = useState(94);
  const [pressureState, setPressure] = useState(0);
  const dirIndex = useRef(3); // W

  /* With reduced motion the sim holds a static, representative frame. */
  const phase: Phase = reduced ? "reservoir" : phaseState;
  const pressure = reduced ? 62 : pressureState;

  /* Supply phase loop: city → lost → reservoir → (repeat) */
  useEffect(() => {
    if (reduced) return;
    const next: Record<Phase, Phase> = { city: "lost", lost: "reservoir", reservoir: "city" };
    const id = setTimeout(() => {
      setPhase((p) => {
        const n = next[p];
        if (n === "city") setReservoirPct(94); // demo loop resets
        return n;
      });
    }, PHASE_DURATION[phase]);
    return () => clearTimeout(id);
  }, [phase, reduced]);

  /* Auto-cycle fire direction */
  useEffect(() => {
    if (!auto || reduced) return;
    const id = setInterval(() => {
      dirIndex.current = (dirIndex.current + 1) % 4;
      setFire(DIRECTIONS[dirIndex.current]);
    }, 8000);
    return () => clearInterval(id);
  }, [auto, reduced]);

  /* Telemetry animation */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setPressure((p) => {
        const target = phase === "lost" ? 18 : 62;
        const delta = target - p;
        return Math.abs(delta) < 2 ? target + Math.round(Math.random() * 3 - 1.5) : p + Math.sign(delta) * 6;
      });
      if (phase === "reservoir") {
        setReservoirPct((r) => Math.max(60, +(r - 0.4).toFixed(1)));
      }
    }, 400);
    return () => clearInterval(id);
  }, [phase, reduced]);

  const activeZones = useMemo(
    () => DIRECTIONS.filter((z) => zoneState(z, fire) !== "standby"),
    [fire]
  );

  const onCityWater = phase === "city";
  const onReservoir = phase === "reservoir";

  function selectDirection(d: Direction) {
    setAuto(false);
    setFire(d);
    dirIndex.current = DIRECTIONS.indexOf(d);
  }

  return (
    <div>
      {/* ── Controls ── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Fire approaching from
        </span>
        <div className="flex gap-1.5" role="group" aria-label="Select fire direction">
          {DIRECTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => selectDirection(d)}
              aria-pressed={fire === d}
              className={`min-w-11 border px-3 py-2.5 font-mono text-sm font-bold transition-all ${
                fire === d
                  ? "border-ember bg-ember/15 text-ember shadow-[0_0_16px_rgba(232,90,36,0.25)]"
                  : "border-line bg-paper-2 text-ink-muted hover:border-ink-muted hover:text-ink"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          aria-pressed={auto}
          className={`border px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
            auto
              ? "border-ember/50 bg-ember/10 text-ember"
              : "border-line bg-paper-2 text-ink-muted hover:text-ink"
          }`}
        >
          {auto ? "Auto-cycling" : "Auto-cycle off"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* ══ LEFT: Zone plan (top view) ══ */}
        <div className="plate-glow relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ember">
              Zone Plan — Top View
            </span>
            <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
              <span className="status-dot" aria-hidden />
              {activeZones.length} of 4 zones deployed
            </span>
          </div>

          <svg
            viewBox="0 0 420 420"
            className="w-full"
            role="img"
            aria-label={`Zone plan: fire approaching from the ${DIR_LABEL[fire].toLowerCase()}. ${DIR_LABEL[fire]} zone active, flanking zones assisting, ${DIR_LABEL[OPPOSITE[fire]].toLowerCase()} zone on standby.`}
          >
            <rect width="420" height="420" fill={SURF} />

            {/* Fire glow bleeding in from the approach direction */}
            <motion.rect
              key={`glow-${fire}`}
              width="420"
              height="420"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              fill={`url(#fireGlow-${fire})`}
            />
            <defs>
              {DIRECTIONS.map((d) => {
                const coords: Record<Direction, { x1: string; y1: string; x2: string; y2: string }> = {
                  N: { x1: "0", y1: "0", x2: "0", y2: "1" },
                  S: { x1: "0", y1: "1", x2: "0", y2: "0" },
                  W: { x1: "0", y1: "0", x2: "1", y2: "0" },
                  E: { x1: "1", y1: "0", x2: "0", y2: "0" },
                };
                const c = coords[d];
                return (
                  <linearGradient key={d} id={`fireGlow-${d}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}>
                    <stop offset="0%" stopColor={EMBER} stopOpacity="0.22" />
                    <stop offset="35%" stopColor={EMBER} stopOpacity="0" />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Zones */}
            {DIRECTIONS.map((z) => {
              const st = zoneState(z, fire);
              const r = ZONES[z];
              const stroke = st === "active" ? EMBER : st === "assist" ? INK : MUTED;
              const dash = st === "active" ? "" : st === "assist" ? "6 3" : "3 5";
              return (
                <g key={z}>
                  <motion.rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill={st === "active" ? EMBER : "none"}
                    stroke={stroke}
                    strokeDasharray={dash}
                    animate={{
                      fillOpacity: st === "active" ? [0.1, 0.2, 0.1] : 0,
                      strokeWidth: st === "active" ? 2 : st === "assist" ? 1.3 : 1,
                      strokeOpacity: st === "standby" ? 0.5 : 1,
                    }}
                    transition={
                      st === "active"
                        ? { fillOpacity: { repeat: Infinity, duration: 2.4 }, duration: 0.5 }
                        : { duration: 0.5 }
                    }
                  />
                  <text
                    x={r.lx}
                    y={r.ly - 6}
                    textAnchor="middle"
                    fill={st === "active" ? EMBER : st === "assist" ? INK : MUTED}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="700"
                  >
                    {z}
                  </text>
                  <text
                    x={r.lx}
                    y={r.ly + 8}
                    textAnchor="middle"
                    fill={st === "active" ? EMBER : MUTED}
                    fontSize="7"
                    fontFamily="monospace"
                    letterSpacing="1"
                  >
                    {st.toUpperCase()}
                  </text>

                  {/* Sprinklers + spray */}
                  {SPRINKLERS[z].map((s, i) => (
                    <g key={i}>
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r={st === "standby" ? 2.5 : 3.2}
                        fill={st === "active" ? EMBER : st === "assist" ? INK : "none"}
                        stroke={st === "standby" ? MUTED : "none"}
                        strokeWidth="1"
                        opacity={st === "standby" ? 0.5 : 0.9}
                      />
                      {st !== "standby" &&
                        SPRAY[z].map((sp, j) => (
                          <motion.line
                            key={j}
                            x1={s.x}
                            y1={s.y}
                            x2={s.x + sp.dx}
                            y2={s.y + sp.dy}
                            stroke={st === "active" ? EMBER_GLOW : WATER}
                            strokeWidth={st === "active" ? 1.4 : 1}
                            animate={{ opacity: [0.2, 0.85, 0.2] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.1,
                              delay: (i * 3 + j) * 0.12,
                            }}
                          />
                        ))}
                    </g>
                  ))}
                </g>
              );
            })}

            {/* House */}
            <rect x="140" y="140" width="140" height="140" fill={SURF2} stroke={INK} strokeWidth="1.5" />
            <text x="210" y="206" textAnchor="middle" fill={MUTED} fontSize="9" fontFamily="monospace" letterSpacing="1.5">
              HOME
            </text>
            <text x="210" y="222" textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace" opacity="0.7">
              PROTECTED
            </text>

            {/* Fire front arrow */}
            <AnimatePresence mode="wait">
              <motion.g
                key={fire}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.line
                  x1={FIRE_ARROWS[fire].x1}
                  y1={FIRE_ARROWS[fire].y1}
                  x2={FIRE_ARROWS[fire].x2}
                  y2={FIRE_ARROWS[fire].y2}
                  stroke={EMBER}
                  strokeWidth="3"
                  markerEnd="url(#fireArrow)"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                />
                <text
                  x={FIRE_ARROWS[fire].tx}
                  y={FIRE_ARROWS[fire].ty}
                  textAnchor="middle"
                  fill={EMBER}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="700"
                  letterSpacing="1.5"
                >
                  FIRE
                </text>
              </motion.g>
            </AnimatePresence>
            <defs>
              <marker id="fireArrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L8,3.5 z" fill={EMBER} />
              </marker>
            </defs>

            {/* Compass */}
            <g transform="translate(392, 32)" opacity="0.7">
              <line x1="0" y1="10" x2="0" y2="-6" stroke={INK} strokeWidth="1" />
              <polygon points="0,-10 -3,-2 3,-2" fill={INK} />
              <text x="0" y="22" textAnchor="middle" fill={MUTED} fontSize="8" fontFamily="monospace">
                N
              </text>
            </g>
          </svg>
        </div>

        {/* ══ RIGHT: Supply + control ══ */}
        <div className="flex flex-col gap-4">
          <div className="plate-glow flex-1 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ember">
                Supply + Control
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className={`font-mono text-[0.65rem] font-bold uppercase tracking-wider ${
                    phase === "lost" ? "text-ember-glow" : "text-ink-muted"
                  }`}
                >
                  {phase === "city" ? "City main" : phase === "lost" ? "⚠ City supply lost" : "Reservoir + pump"}
                </motion.span>
              </AnimatePresence>
            </div>

            <svg viewBox="0 0 340 380" className="w-full" role="img" aria-label="Supply chain: city water or reservoir feeds the mixing manifold where retardant is injected, then the pump pressurizes zone solenoids.">
              <rect width="340" height="380" fill={SURF} />

              {/* City main */}
              <SupplyBox x={18} y={16} w={140} h={44} label="CITY MAIN" sub={onCityWater ? "supplying" : "offline"} active={onCityWater} dead={!onCityWater} />
              {/* Reservoir */}
              <SupplyBox x={182} y={16} w={140} h={44} label="RESERVOIR" sub={`${Math.round(reservoirPct)}% · 5–15k gal`} active={onReservoir} />

              {/* Feed lines into manifold */}
              <path d="M88 60 V 88 H 165" fill="none" stroke={onCityWater ? WATER : LINE} strokeWidth={onCityWater ? 2 : 1.2} className={onCityWater ? "flow-line" : undefined} />
              <path d="M252 60 V 88 H 175" fill="none" stroke={onReservoir ? WATER : LINE} strokeWidth={onReservoir ? 2 : 1.2} className={onReservoir ? "flow-line" : undefined} />
              <line x1="170" y1="88" x2="170" y2="106" stroke={phase === "lost" ? LINE : WATER} strokeWidth={phase === "lost" ? 1.2 : 2} className={phase !== "lost" ? "flow-line" : undefined} />

              {/* Retardant tank (side inject) */}
              <rect x="18" y="106" width="92" height="40" fill={SURF2} stroke={EMBER} strokeWidth="1.3" />
              <text x="64" y="123" textAnchor="middle" fill={EMBER} fontSize="8.5" fontFamily="monospace" fontWeight="600">RETARDANT</text>
              <text x="64" y="136" textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace">bio-safe · yard-safe</text>
              <line x1="110" y1="126" x2="128" y2="126" stroke={phase !== "lost" ? EMBER : LINE} strokeWidth={phase !== "lost" ? 2 : 1.2} className={phase !== "lost" ? "flow-line" : undefined} />

              {/* Mixing manifold */}
              <rect x="128" y="106" width="140" height="40" fill={SURF2} stroke={LINE} strokeWidth="1.2" />
              <text x="198" y="123" textAnchor="middle" fill={INK} fontSize="8.5" fontFamily="monospace" fontWeight="600">MIXING MANIFOLD</text>
              <text x="198" y="136" textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace">venturi injection</text>

              <line x1="198" y1="146" x2="198" y2="168" stroke={phase !== "lost" ? EMBER_GLOW : LINE} strokeWidth={phase !== "lost" ? 2 : 1.2} className={phase !== "lost" ? "flow-line" : undefined} />

              {/* Pump */}
              <rect x="128" y="168" width="140" height="40" fill={SURF2} stroke={onReservoir ? EMBER : LINE} strokeWidth={onReservoir ? 1.6 : 1.2} />
              <text x="198" y="185" textAnchor="middle" fill={onReservoir ? EMBER : INK} fontSize="8.5" fontFamily="monospace" fontWeight="600">
                PUMP {onReservoir ? "· RUNNING" : "· STANDBY"}
              </text>
              <text x="198" y="198" textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace">pressurizes zone lines</text>

              <line x1="198" y1="208" x2="198" y2="230" stroke={phase !== "lost" ? EMBER_GLOW : LINE} strokeWidth={phase !== "lost" ? 2 : 1.2} className={phase !== "lost" ? "flow-line" : undefined} />

              {/* Controller */}
              <rect x="88" y="230" width="220" height="48" fill={SURF2} stroke={EMBER} strokeWidth="1.8" />
              <text x="198" y="249" textAnchor="middle" fill={EMBER} fontSize="9" fontFamily="monospace" fontWeight="700">CONTROLLER · RASPBERRY PI</text>
              <text x="198" y="262" textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace">solar powered · user-set bearing · zone routing</text>
              <circle cx="100" cy="242" r="3" fill={EMBER_GLOW}>
                <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
              </circle>

              <line x1="198" y1="278" x2="198" y2="296" stroke={LINE} strokeWidth="1" />
              <line x1="60" y1="296" x2="336" y2="296" stroke={LINE} strokeWidth="1" />

              {/* Solenoids */}
              {DIRECTIONS.map((z, i) => {
                const st = zoneState(z, fire);
                const open = st !== "standby" && phase !== "lost";
                const bx = 60 + i * 72;
                return (
                  <g key={z}>
                    <line x1={bx + 28} y1="296" x2={bx + 28} y2="306" stroke={LINE} strokeWidth="1" />
                    <motion.rect
                      x={bx}
                      y={306}
                      width={56}
                      height={52}
                      fill={open ? EMBER : SURF2}
                      stroke={open ? EMBER : LINE}
                      animate={{ fillOpacity: open ? 0.14 : 1, strokeWidth: open ? 1.8 : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <text x={bx + 28} y={328} textAnchor="middle" fill={open ? EMBER : INK} fontSize="12" fontFamily="monospace" fontWeight="700">
                      {z}
                    </text>
                    <text x={bx + 28} y={345} textAnchor="middle" fill={open ? EMBER_GLOW : MUTED} fontSize="6.5" fontFamily="monospace" fontWeight="600">
                      {open ? "OPEN" : "READY"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Telemetry ── */}
          <div className="plate grid grid-cols-3 divide-x divide-line">
            <Telemetry label="Reservoir" value={`${Math.round(reservoirPct)}%`} warn={reservoirPct < 70} />
            <Telemetry label="Line Pressure" value={`${Math.max(0, pressure)} PSI`} warn={phase === "lost"} />
            <Telemetry label="Zones Active" value={phase === "lost" ? "HOLD" : `${activeZones.length} / 4`} warn={phase === "lost"} />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.15em] text-ink-muted">
        Fig. 01 — Interactive simulation (concept). Tap a direction to redeploy zones.
      </p>
    </div>
  );
}

function SupplyBox({
  x, y, w, h, label, sub, active, dead,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; active: boolean; dead?: boolean;
}) {
  return (
    <g>
      <motion.rect
        x={x} y={y} width={w} height={h}
        fill={SURF2}
        stroke={active ? WATER : dead ? LINE : LINE}
        animate={{ strokeWidth: active ? 1.8 : 1.2, opacity: dead ? 0.55 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fill={active ? WATER : dead ? MUTED : INK} fontSize="9" fontFamily="monospace" fontWeight="600">
        {label}
      </text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle" fill={MUTED} fontSize="6.5" fontFamily="monospace">
        {sub}
      </text>
    </g>
  );
}

function Telemetry({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">{label}</p>
      <p className={`mt-1 font-mono text-lg font-bold tabular-nums ${warn ? "text-ember-glow" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
