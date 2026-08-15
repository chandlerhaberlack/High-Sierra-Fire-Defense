"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const W = 192;
const H = 108;

/* Thermal palette LUT: cold navy → purple → ember → yellow → white */
const STOPS: [number, [number, number, number]][] = [
  [0.0, [8, 12, 40]],
  [0.35, [70, 30, 110]],
  [0.6, [200, 70, 40]],
  [0.82, [255, 200, 70]],
  [1.0, [255, 255, 240]],
];

function lut(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1];
      const [t1, c1] = STOPS[i];
      const f = (t - t0) / (t1 - t0);
      return [
        c0[0] + (c1[0] - c0[0]) * f,
        c0[1] + (c1[1] - c0[1]) * f,
        c0[2] + (c1[2] - c0[2]) * f,
      ];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

interface Props {
  on: boolean;
  lowPower: boolean;
  /** 0..1 — how much fire signature is visible on the horizon */
  fireIntensity: number;
  /** Explore mode: let the user flip between normal and low-power feed */
  onToggleLowPower?: () => void;
}

/** Simulated live thermal camera feed (clearly labeled as a concept mock). */
export function ThermalCamera({ on, lowPower, fireIntensity, onToggleLowPower }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [clock, setClock] = useState("");

  useEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const block = lowPower ? 8 : 4;
    const cols = Math.ceil(W / block);
    const rows = Math.ceil(H / block);

    function drawFrame() {
      if (!ctx) return;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;
          /* Cool sky above the horizon, warmer ground below */
          const horizon = 0.42;
          let v = ny < horizon ? 0.1 + ny * 0.18 : 0.24 + (ny - horizon) * 0.3;
          /* Ridgeline bumps */
          v += 0.05 * Math.sin(nx * 9) * (ny > horizon - 0.08 && ny < horizon + 0.1 ? 1 : 0);
          /* Sensor noise */
          v += (Math.random() - 0.5) * (lowPower ? 0.1 : 0.06);
          /* Fire signature cresting the ridge, upper right */
          if (fireIntensity > 0) {
            const dx = nx - 0.76;
            const dy = ny - 0.38;
            const rad = 0.05 + fireIntensity * 0.14;
            const d2 = (dx * dx) / (rad * rad * 2.4) + (dy * dy) / (rad * rad);
            v += fireIntensity * Math.exp(-d2) * (0.9 + Math.random() * 0.25);
          }
          if (lowPower) v *= 0.85;
          const [red, g, b] = lut(v);
          ctx.fillStyle = `rgb(${red | 0},${g | 0},${b | 0})`;
          ctx.fillRect(c * block, r * block, block, block);
        }
      }
      setClock(new Date().toLocaleTimeString([], { hour12: false }));
    }

    drawFrame();
    if (reduced) return;
    const id = setInterval(drawFrame, lowPower ? 700 : 130);
    return () => clearInterval(id);
  }, [on, lowPower, fireIntensity, reduced]);

  return (
    <div className="plate flex h-full min-h-[260px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">
          Thermal Cam 1 · NE · 180°
        </span>
        {on ? (
          <span className={`flex items-center gap-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider ${lowPower ? "text-pulse" : "text-ember"}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${lowPower ? "bg-pulse" : "bg-ember"} animate-pulse`} aria-hidden />
            {lowPower ? "Live · Low Pwr" : "Live"}
          </span>
        ) : (
          <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-ink-muted">Sleeping</span>
        )}
      </div>

      <div className="relative flex-1 bg-void">
        {on ? (
          <>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="h-full w-full object-cover"
              style={{ imageRendering: "pixelated" }}
              role="img"
              aria-label={`Simulated thermal camera feed${fireIntensity > 0.3 ? " showing a heat signature on the ridge" : ""}.`}
            />
            {/* HUD overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2 font-mono text-[0.6rem] uppercase tracking-wider">
              <div className="flex justify-between text-white/70">
                <span>{lowPower ? "8-BIT · 1.4 FPS" : "14-BIT · 9 FPS"}</span>
                <span>{clock}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="bg-black/50 px-1.5 py-0.5 text-white/60">Simulated feed — concept</span>
                {fireIntensity > 0.3 && (
                  <span className="animate-pulse bg-black/50 px-1.5 py-0.5 font-bold text-ember-glow">⚠ Heat sig NE</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-2xl opacity-40" aria-hidden>◉</span>
            <p className="text-xs leading-relaxed text-ink-muted">
              Cameras sleep through normal conditions and power on automatically at{" "}
              <span className="text-ink">Level 2</span> — a red flag warning or
              evacuation notice.
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted opacity-60">
              Raise the readiness level to wake them
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-3 py-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted">
          {lowPower ? "Solar + battery" : "Grid power"}
        </span>
        {onToggleLowPower ? (
          <div className="flex gap-1" role="group" aria-label="Camera power mode">
            {(["normal", "low"] as const).map((m) => {
              const active = (m === "low") === lowPower;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => !active && onToggleLowPower()}
                  aria-pressed={active}
                  className={`border px-2 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? m === "low"
                        ? "border-pulse/50 bg-pulse/10 text-pulse"
                        : "border-water/50 bg-water-dim text-water"
                      : "border-line bg-paper-3 text-ink-muted hover:text-ink"
                  }`}
                >
                  {m === "low" ? "Low power" : "Normal"}
                </button>
              );
            })}
          </div>
        ) : (
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted opacity-70">
            Mode follows grid status
          </span>
        )}
      </div>
    </div>
  );
}
