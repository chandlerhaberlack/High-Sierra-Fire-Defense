"use client";

import dynamic from "next/dynamic";
import { Section } from "./ui/Section";

const FireMap = dynamic(() => import("./FireMap").then((m) => m.FireMap), {
  ssr: false,
  loading: () => (
    <div className="plate-glow flex min-h-[440px] items-center justify-center md:min-h-[540px]">
      <p className="text-sm text-ink-muted">Loading wildfire history…</p>
    </div>
  ),
});

export function RiskMap() {
  return (
    <Section id="fire-history" wide glow="right">
      <p className="index-label">01 / The Threat</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        This is your neighborhood&apos;s fire history.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Every recorded wildfire since 1950 within a hundred miles of Lake Tahoe, on
        both sides of the state line. Brighter shapes burned recently; darker ones
        decades ago. Drag the year range to watch the pattern accelerate, and tap a
        burn area for the fire&apos;s name, year, and size — then ask how close the
        nearest one came to your street.
      </p>

      <div className="mt-10">
        <FireMap />
      </div>
    </Section>
  );
}
