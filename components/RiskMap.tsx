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
    <Section id="fire-history" wide>
      <p className="index-label">01 / The Threat</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        This is your neighborhood&apos;s fire history.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Four decades of recorded wildfires around Reno, Lake Tahoe, Truckee, and
        Carson City. Every orange shape is ground that has already burned. Tap a
        burn area for the fire&apos;s name, year, and size — then ask how close the
        nearest one came to your street.
      </p>

      <div className="mt-10">
        <FireMap />
      </div>
    </Section>
  );
}
