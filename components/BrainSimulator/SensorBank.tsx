"use client";

import type { ComponentId, SensorId, SimSnapshot } from "./data";
import { SENSOR_IDS, SENSOR_META } from "./data";

interface Props {
  snap: SimSnapshot;
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  /** Explore mode: simulate a detection on a sensor. */
  onTrip?: (id: SensorId) => void;
}

/**
 * All three detection layers in one place, so it's obvious at a glance
 * which ones have triggered and how many votes the computer needs.
 */
export function SensorBank({ snap, selected, onSelect, onTrip }: Props) {
  const { tripped, camerasOn, votesRequired } = snap;

  return (
    <div className="plate overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
        <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">
          Detection Layers — the three votes
        </span>
        <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-wider ${tripped.size > 0 ? "text-lv3" : "text-ink-muted"}`}>
          {tripped.size}/3 detecting · needs {votesRequired} to deploy
        </span>
      </div>

      <div className="divide-y divide-line">
        {SENSOR_IDS.map((id) => {
          const meta = SENSOR_META[id];
          const isTripped = tripped.has(id);
          const sleeping = id === "cameras" && !camerasOn;
          const status = isTripped ? "DETECTED" : sleeping ? "SLEEPING" : "WATCHING";
          const isSelected = selected === id;

          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(id);
                }
              }}
              aria-label={`${meta.name} — status ${status.toLowerCase()}, tap to learn more`}
              className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-3 transition-colors ${
                isSelected ? "bg-water-dim" : "hover:bg-paper-3"
              } ${sleeping && !isSelected ? "opacity-70" : ""}`}
            >
              <div className="min-w-0">
                <span className="block font-display text-sm font-semibold text-ink">{meta.name}</span>
                <span className="mt-0.5 block truncate font-mono text-[0.62rem] uppercase tracking-wider text-ink-muted">
                  {meta.sub}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {onTrip && !isTripped && (
                  <button
                    type="button"
                    disabled={sleeping}
                    title={sleeping ? "Cameras are asleep — raise the readiness level to wake them" : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrip(id);
                    }}
                    className={`border px-2 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-wider transition-colors ${
                      sleeping
                        ? "cursor-not-allowed border-line text-ink-muted opacity-50"
                        : "border-lv3/40 text-lv3 hover:bg-lv3/10"
                    }`}
                  >
                    Trip
                  </button>
                )}
                {onTrip && isTripped && (
                  <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-lv3">✓ Voted</span>
                )}
                <span
                  className={`flex w-[5.5rem] items-center justify-center gap-1.5 border px-1.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-wider ${
                    isTripped
                      ? "border-lv3/50 bg-lv3/10 text-lv3"
                      : sleeping
                        ? "border-line bg-paper-3 text-ink-muted"
                        : "border-lv1/40 bg-lv1/10 text-lv1"
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      isTripped ? "animate-pulse bg-lv3" : sleeping ? "bg-ink-muted" : "bg-lv1"
                    }`}
                    aria-hidden
                  />
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
