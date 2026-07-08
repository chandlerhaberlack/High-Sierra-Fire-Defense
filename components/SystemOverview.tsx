"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "./ui/Section";
import { FireSimulator } from "./FireSimulator";
import { products, type ProductTier } from "@/lib/site";

const TIERS: ProductTier[] = ["shield", "guardian"];

const copy: Record<
  ProductTier,
  { heading: string; intro: string; steps: { n: string; title: string; copy: string }[] }
> = {
  shield: {
    heading: "It soaks the whole perimeter.",
    intro:
      "Pure water defense, zero complexity. One SMS command opens all four perimeter zones at once — north, east, south, and west — soaking your roofline and defensible space on every side. City water first, on-site reservoir when supply fails.",
    steps: [
      {
        n: "A",
        title: "You send one command",
        copy: "Text the system to deploy. No aiming, no configuration — one SMS and it goes to work.",
      },
      {
        n: "B",
        title: "All four zones deploy",
        copy: "North, east, south, and west open together. Water soaks the roofline and perimeter on every side of the home.",
      },
      {
        n: "C",
        title: "City water, then reservoir",
        copy: "The system runs on the city main until municipal supply fails — then switches to the on-site reservoir and pump without missing a beat.",
      },
    ],
  },
  guardian: {
    heading: "It defends in the direction of the fire.",
    intro:
      "The perimeter is divided into four zones — north, east, south, west — each with its own solenoid valve. Bio-safe retardant injects into the water stream, the pump pressurizes the lines, and the control system routes flow exactly where the fire is coming from. Try it: pick a direction.",
    steps: [
      {
        n: "A",
        title: "You set the fire direction",
        copy: "Point the system at where the fire is coming from — north, east, south, or west. Deployment skews to that bearing.",
      },
      {
        n: "B",
        title: "Three zones deploy",
        copy: "Windward and flanking zones open; the leeward zone holds in reserve, cycling on for 1 minute every 10 minutes by default. Adjust the timing — or run all four zones at once.",
      },
      {
        n: "C",
        title: "City water, then reservoir",
        copy: "The system runs on the city main until municipal supply fails — then switches to the on-site reservoir and pump without missing a beat.",
      },
    ],
  },
};

export function SystemOverview() {
  const [tier, setTier] = useState<ProductTier>("guardian");
  const c = copy[tier];

  return (
    <Section id="how-it-works" contour wide glow="left">
      <p className="index-label">02 / How It Works</p>

      {/* ── Product toggle ── */}
      <div className="mt-6 inline-flex border border-line bg-paper-2 p-1" role="group" aria-label="Choose a product">
        {TIERS.map((t) => {
          const p = products[t];
          const selected = tier === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              aria-pressed={selected}
              className="relative px-5 py-3 text-left transition-colors"
            >
              {selected && (
                <motion.span
                  layoutId="tier-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className={`absolute inset-0 border ${
                    t === "shield" ? "border-water/60 bg-water-dim" : "border-ember/60 bg-ember-dim"
                  }`}
                  aria-hidden
                />
              )}
              <span className="relative block">
                <span
                  className={`block font-mono text-[0.6rem] font-semibold uppercase tracking-[0.15em] ${
                    selected ? (t === "shield" ? "text-water" : "text-ember") : "text-ink-muted"
                  }`}
                >
                  {p.tier}
                </span>
                <span
                  className={`mt-0.5 block font-display text-base font-semibold ${
                    selected ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {p.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tier}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {c.heading}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">{c.intro}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10">
        <FireSimulator tier={tier} />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {c.steps.map((s) => (
          <div key={s.n} className="border-t border-line pt-5">
            <p className={`font-mono text-xs font-bold ${tier === "shield" ? "text-water" : "text-ember"}`}>
              {s.n}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${tier}-${s.n}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.copy}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}
