import { Section } from "./ui/Section";

const points = [
  {
    title: "Ember storms ignite before flames arrive",
    description:
      "Wind-driven ember showers can ignite vulnerable exterior areas — eaves, decks, vents, roofs, and dry vegetation — before direct flame contact reaches the structure.",
  },
  {
    title: "Evacuation removes manual defense",
    description:
      "When evacuation orders hit, homeowners often cannot stay to hose down roofs, decks, or perimeter zones. Active exterior defense must be ready before you leave.",
  },
  {
    title: "Defensible space alone isn't enough",
    description:
      "Traditional landscaping and defensible space help significantly, but many homes still lack an active exterior water-defense layer for ember and radiant heat exposure.",
  },
  {
    title: "Insurance and hardening pressure is rising",
    description:
      "In Reno, Tahoe, and Sierra foothill communities, insurance scrutiny, home hardening requirements, and water preparedness are becoming critical infrastructure concerns.",
  },
];

export function Problem() {
  return (
    <Section topo>
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
          The Problem
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Wildfire Risk Is Becoming a Home Infrastructure Problem
        </h2>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Many homes are lost not from direct flame contact, but from embers,
          radiant heat, and vulnerable exterior surfaces. Homeowners across the
          Sierra face increasing exposure with limited time to act once
          evacuation orders are issued.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {points.map((point, i) => (
          <div
            key={point.title}
            className="group rounded-lg border border-surface-border bg-surface/60 p-6 transition-colors hover:border-teal/30"
          >
            <span className="font-mono text-xs text-ember/80">
              0{i + 1}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
