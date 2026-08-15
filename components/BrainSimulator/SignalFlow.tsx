"use client";

import { motion } from "motion/react";
import type { ComponentId, SimSnapshot } from "./data";
import { COMPONENTS, EVAC_LABEL } from "./data";
import {
  INK, MUTED, LINE, SURF, SURF2, EMBER, EMBER_GLOW, RETARDANT, RETARDANT_GLOW, OK,
  LV3, LV3_GLOW, LEVEL_COLOR, EVAC_COLOR,
} from "./palette";

interface Props {
  snap: SimSnapshot;
  smsCount: number;
  manualLevel: boolean;
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
}

interface BoxSpec {
  id: ComponentId;
  x: number; y: number; w: number; h: number;
  title: string;
  sub: string;
  accent: string;
  dim?: boolean;
}

/**
 * Signal-flow schematic: the three detection layers vote, the brain counts,
 * the pump deploys. Every box is tappable and mirrors the property view.
 */
export function SignalFlow({ snap, smsCount, manualLevel, selected, onSelect }: Props) {
  const { level, votesRequired, tripped, deployed, camerasOn, gridPower, evac } = snap;

  const related = new Set<ComponentId>(selected ? COMPONENTS[selected].connects : []);

  const sensorAccent = (id: "nodes" | "air" | "cameras") =>
    tripped.has(id) ? LV3 : id === "cameras" && !camerasOn ? MUTED : OK;
  const sensorSub = (id: "nodes" | "air" | "cameras") =>
    tripped.has(id) ? "DETECTED" : id === "cameras" ? (camerasOn ? "scanning" : "sleeping") : "watching";

  const boxes: BoxSpec[] = [
    { id: "nodes", x: 10, y: 14, w: 100, h: 44, title: "8× NODES", sub: sensorSub("nodes"), accent: sensorAccent("nodes") },
    { id: "air", x: 120, y: 14, w: 100, h: 44, title: "AIR SENSOR", sub: sensorSub("air"), accent: sensorAccent("air") },
    { id: "cameras", x: 230, y: 14, w: 100, h: 44, title: "THERMAL CAMS", sub: sensorSub("cameras"), accent: sensorAccent("cameras"), dim: !camerasOn },
    { id: "watchduty", x: 10, y: 100, w: 88, h: 50, title: "GPS + WATCHDUTY", sub: manualLevel ? "manual level" : evac === "none" ? "no evac orders" : `evac: ${EVAC_LABEL[evac]}`, accent: EVAC_COLOR[evac] },
    { id: "sms", x: 242, y: 100, w: 88, h: 50, title: "SMS TEXT", sub: `${smsCount} text${smsCount === 1 ? "" : "s"} sent`, accent: OK },
    { id: "tank", x: 10, y: 202, w: 88, h: 50, title: "RESERVOIR", sub: deployed ? "74% · feeding" : "100% · ready", accent: RETARDANT },
    { id: "pump", x: 126, y: 202, w: 88, h: 50, title: "PUMP", sub: deployed ? "RUNNING" : "standby", accent: deployed ? RETARDANT_GLOW : INK },
    { id: "zones", x: 242, y: 202, w: 88, h: 50, title: "4 ZONES", sub: deployed ? "DEPLOYING" : "ready · N E S W", accent: deployed ? RETARDANT_GLOW : INK },
    { id: "power", x: 10, y: 282, w: 320, h: 36, title: gridPower ? "POWER: GRID ✓ · SOLAR + BATTERY STANDBY" : "POWER: SOLAR + BATTERY · LOW-POWER MODE", sub: "", accent: gridPower ? MUTED : OK },
  ];

  const trippedCount = tripped.size;

  const flowTo = (active: boolean, hot?: boolean) => ({
    stroke: active ? (hot ? LV3 : OK) : LINE,
    strokeWidth: active ? 1.8 : 1,
    className: active ? "flow-line" : undefined,
  });

  return (
    <div className="plate-glow overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ember">
          How the Signals Flow
        </span>
        <span className={`font-mono text-[0.65rem] uppercase tracking-wider ${trippedCount > 0 ? "text-lv3" : "text-ink-muted"}`}>
          {trippedCount}/3 detecting · needs {votesRequired}
        </span>
      </div>

      <svg
        viewBox="0 0 340 330"
        className="w-full"
        role="img"
        aria-label={`Signal flow: ${trippedCount} of 3 detection layers report fire; ${votesRequired} needed at Level ${level}. ${deployed ? "System deployed." : "System holding."}`}
      >
        <rect width="340" height="330" fill={SURF} />

        {/* Sensor → brain lines */}
        <path d="M60 58 V 78 H 150 V 92" fill="none" {...flowTo(tripped.has("nodes"), true)} />
        <line x1="170" y1="58" x2="170" y2="92" {...flowTo(tripped.has("air"), true)} />
        <path d="M280 58 V 78 H 190 V 92" fill="none" {...flowTo(tripped.has("cameras"), true)} />

        {/* WatchDuty → brain, brain → SMS */}
        <line x1="98" y1="125" x2="112" y2="125" {...flowTo(true)} />
        <line x1="228" y1="125" x2="242" y2="125" {...flowTo(smsCount > 0)} />

        {/* SMS → phone chip */}
        <line x1="286" y1="150" x2="286" y2="162" stroke={LINE} strokeWidth="1" />
        <g
          role="button" tabIndex={0} style={{ cursor: "pointer" }}
          aria-label="Your phone — tap to learn more"
          onClick={() => onSelect("phone")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect("phone"); } }}
        >
          <rect x="250" y="162" width="72" height="22" fill={SURF2}
            stroke={selected === "phone" ? OK : related.has("phone") ? OK : LINE}
            strokeWidth={selected === "phone" ? 1.6 : 1}
            strokeDasharray={selected !== "phone" && related.has("phone") ? "4 3" : undefined}
          />
          <text x="286" y="176" textAnchor="middle" fill={INK} fontSize="6.5" fontFamily="monospace" fontWeight="600">📱 YOUR PHONE</text>
        </g>

        {/* Brain → pump */}
        <line x1="170" y1="146" x2="170" y2="202" {...flowTo(deployed, true)} />
        {/* Tank → pump → zones */}
        <line x1="98" y1="227" x2="126" y2="227" {...(deployed ? { stroke: RETARDANT, strokeWidth: 1.8, className: "flow-line" } : { stroke: LINE, strokeWidth: 1 })} />
        <line x1="214" y1="227" x2="242" y2="227" {...(deployed ? { stroke: RETARDANT, strokeWidth: 1.8, className: "flow-line" } : { stroke: LINE, strokeWidth: 1 })} />
        {/* Power → pump/brain */}
        <line x1="170" y1="252" x2="170" y2="282" stroke={gridPower ? LINE : OK} strokeWidth="1" opacity="0.8" />

        {/* ── The central computer ── */}
        <g
          role="button" tabIndex={0} style={{ cursor: "pointer" }}
          aria-label="Central computer — tap to learn more"
          onClick={() => onSelect("brain")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect("brain"); } }}
        >
          <motion.rect
            x="112" y="92" width="116" height="54" fill={SURF2}
            initial={false}
            animate={{
              stroke: selected === "brain" ? OK : deployed ? EMBER_GLOW : EMBER,
              strokeWidth: selected === "brain" ? 2.2 : 1.8,
            }}
            strokeDasharray={selected !== "brain" && related.has("brain") ? "5 3" : undefined}
          />
          <text x="170" y="108" textAnchor="middle" fill={EMBER} fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">CENTRAL COMPUTER</text>
          <text x="170" y="120" textAnchor="middle" fill={LEVEL_COLOR[level]} fontSize="7" fontFamily="monospace" fontWeight="700">
            LEVEL {level} · needs {votesRequired} of 3
          </text>
          {/* vote dots */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={152 + i * 18} cy="133" r="4"
              fill={i < trippedCount ? LV3 : "none"}
              stroke={i < votesRequired ? (i < trippedCount ? LV3_GLOW : INK) : MUTED}
              strokeWidth="1"
              opacity={i < votesRequired ? 1 : 0.4}
            />
          ))}
          <circle cx="120" cy="100" r="2.5" fill={EMBER_GLOW}>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ── All other boxes ── */}
        {boxes.map((b) => {
          const isSel = selected === b.id;
          const isRel = !isSel && related.has(b.id);
          return (
            <g
              key={b.id}
              role="button" tabIndex={0} style={{ cursor: "pointer" }}
              aria-label={`${COMPONENTS[b.id].name} — tap to learn more`}
              onClick={() => onSelect(b.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(b.id); } }}
              opacity={b.dim && !isSel ? 0.55 : 1}
            >
              <motion.rect
                x={b.x} y={b.y} width={b.w} height={b.h} fill={SURF2}
                initial={false}
                animate={{
                  stroke: isSel ? OK : b.accent === MUTED || b.accent === INK ? LINE : b.accent,
                  strokeWidth: isSel ? 2 : 1.2,
                }}
                strokeDasharray={isRel ? "5 3" : undefined}
              />
              {isRel && <rect x={b.x - 3} y={b.y - 3} width={b.w + 6} height={b.h + 6} fill="none" stroke={OK} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" />}
              <text
                x={b.x + b.w / 2} y={b.y + (b.sub ? 19 : b.h / 2 + 3)}
                textAnchor="middle" fill={b.accent} fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.5"
              >
                {b.title}
              </text>
              {b.sub && (
                <text x={b.x + b.w / 2} y={b.y + 34} textAnchor="middle" fill={b.sub === "DETECTED" || b.sub === "DEPLOYING" || b.sub === "RUNNING" ? b.accent : MUTED} fontSize="6.5" fontFamily="monospace">
                  {b.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
