"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentId, SensorId } from "./data";
import { COMPONENTS, SENSOR_IDS } from "./data";

const KIND_COLOR: Record<string, string> = {
  Detection: "text-ember border-ember/40 bg-ember/10",
  "Central Computer": "text-ember-glow border-ember/50 bg-ember/15",
  Deployment: "text-pulse border-pulse/40 bg-pulse/10",
  Communication: "text-water border-water/40 bg-water-dim",
  Power: "text-water border-water/40 bg-water-dim",
};

interface Props {
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  /** Explore mode only: simulate a detection on the selected sensor. */
  onTrip?: (id: SensorId) => void;
  tripped?: ReadonlySet<SensorId>;
  camerasOn?: boolean;
}

export function Explainer({ selected, onSelect, onTrip, tripped, camerasOn }: Props) {
  const info = selected ? COMPONENTS[selected] : null;
  const isSensor = !!info && (SENSOR_IDS as readonly string[]).includes(info.id);
  const alreadyTripped = isSensor && tripped?.has(info!.id as SensorId);
  const sleeping = !!info && info.id === "cameras" && !camerasOn;

  return (
    <div className="plate flex h-full min-h-[260px] flex-col overflow-hidden">
      <div className="border-b border-line px-4 py-2.5">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">
          What Am I Looking At?
        </span>
      </div>

      <div className="relative flex-1 p-4">
        <AnimatePresence mode="wait" initial={false}>
          {!info ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col justify-center text-center"
            >
              <p className="text-sm leading-relaxed text-ink-muted">
                Tap any part of the system — on the property map or in the signal
                flow — and this panel explains what it is, what it watches for, and
                what it&apos;s connected to.
              </p>
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted opacity-70">
                No jargon. Promise.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <span className={`inline-block border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-wider ${KIND_COLOR[info.kind]}`}>
                {info.kind}
              </span>
              <h4 className="mt-2 font-display text-lg font-semibold text-ink">{info.name}</h4>

              <dl className="mt-3 space-y-2.5 text-[0.8125rem] leading-relaxed">
                <div>
                  <dt className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-ink-muted">What it is</dt>
                  <dd className="mt-0.5 text-ink-muted">{info.what}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-ink-muted">What it does</dt>
                  <dd className="mt-0.5 text-ink-muted">{info.does}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-ink-muted">Where it leads</dt>
                  <dd className="mt-0.5 text-ink-muted">{info.feeds}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted">Wired to:</span>
                {info.connects.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onSelect(c)}
                    className="border border-line bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] text-ink-muted transition-colors hover:border-water hover:text-water"
                  >
                    {COMPONENTS[c].name}
                  </button>
                ))}
              </div>

              {isSensor && onTrip && (
                <button
                  type="button"
                  disabled={alreadyTripped || sleeping}
                  onClick={() => onTrip(info.id as SensorId)}
                  className={`mt-4 w-full border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                    alreadyTripped
                      ? "cursor-default border-lv3/40 bg-lv3/10 text-lv3"
                      : sleeping
                        ? "cursor-not-allowed border-line text-ink-muted opacity-60"
                        : "border-lv3/50 bg-lv3/10 text-lv3 hover:bg-lv3/20"
                  }`}
                >
                  {alreadyTripped
                    ? "✓ Detection reported to the computer"
                    : sleeping
                      ? "Cameras are asleep — raise the level to wake them"
                      : "Simulate a detection on this sensor"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
