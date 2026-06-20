import { Section } from "./ui/Section";
import { ScadaPanel } from "./ScadaPanel";

const pillars = [
  {
    title: "Exterior Water Distribution",
    description: "Purpose-built for roofline, eave, and perimeter pre-wetting — not interior suppression.",
  },
  {
    title: "Zoned Control",
    description: "Independent valve zones for targeted activation based on exposure and risk level.",
  },
  {
    title: "Serviceability",
    description: "Components designed for accessible maintenance, inspection, and seasonal commissioning.",
  },
  {
    title: "Off-Grid Readiness",
    description: "On-site water storage options for properties without reliable utility supply during events.",
  },
  {
    title: "Backup Power",
    description: "Battery or generator integration to maintain operation when the grid goes down.",
  },
  {
    title: "Manual Override",
    description: "On-site manual activation for homeowners who need direct control without remote dependency.",
  },
  {
    title: "Inspection-Friendly Design",
    description: "Layout and documentation structured for annual contractor inspection and commissioning.",
  },
  {
    title: "Insurer-Friendly Documentation",
    description: "System readiness records designed to support future insurance and hardening conversations.",
  },
  {
    title: "Retrofit Constraints",
    description: "Engineered around the practical realities of upgrading existing mountain and foothill homes.",
  },
];

export function Engineering() {
  return (
    <Section grid className="scan-lines">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
            Engineering
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Engineered for Real-World Conditions
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            This system is being designed by engineers who understand mountain
            home infrastructure — not adapted from flatland irrigation or
            interior sprinkler standards. Every component is evaluated against
            the realities of Sierra Nevada wildfire exposure.
          </p>

          <div className="mt-8 lg:hidden">
            <ScadaPanel compact />
          </div>
        </div>

        <div className="hidden lg:block">
          <ScadaPanel />
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-lg border border-surface-border bg-surface/40 p-5 hover:border-teal/20 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-foreground">
              {pillar.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
