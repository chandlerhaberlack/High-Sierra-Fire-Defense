import { Section } from "./ui/Section";
import { SystemRender } from "./SystemRender";

const components = [
  {
    title: "Roofline & Eave Zones",
    description: "Targeted sprinkler coverage along roof edges and eaves — primary ember ignition points.",
  },
  {
    title: "Perimeter & Deck Coverage",
    description: "Exterior zones for decks, fences, and ground-level exposure areas.",
  },
  {
    title: "Water Supply Integration",
    description: "On-site tank storage or utility-fed supply with pump capacity for sustained pre-wetting.",
  },
  {
    title: "Electrically Controlled Valves",
    description: "Zoned valve control for independent activation of roofline, eave, and perimeter areas.",
  },
  {
    title: "Backup Power Readiness",
    description: "Battery or generator backup to maintain system operation during grid outages.",
  },
  {
    title: "Environmental Monitoring",
    description: "Weather, wind, and system-health sensors for readiness assessment.",
  },
  {
    title: "Local & Remote Activation",
    description: "Manual override on-site plus remote activation capability when away from property.",
  },
  {
    title: "Annual Inspection Program",
    description: "Optional contractor-installed commissioning and annual inspection for maintained readiness.",
  },
];

export function SystemOverview() {
  return (
    <Section id="system" grid>
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
            System Overview
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A Smarter Exterior Water-Defense System
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            The proposed system combines roofline sprinkler zones, eave and
            perimeter coverage, water storage or utility-fed supply, pumps,
            valves, backup power, sensors, and a central controller. The goal is
            to pre-wet key exterior zones before and during wildfire exposure,
            while giving homeowners a clear way to monitor readiness.
          </p>
          <p className="mt-4 text-sm text-muted/80 leading-relaxed">
            This is an exterior wildfire mitigation and pre-wetting system — not
            an interior fire sprinkler system and not a guarantee that a
            structure will survive a wildfire.
          </p>
        </div>

        <SystemRender />
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {components.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-surface-border bg-surface/40 p-5 hover:border-teal/20 transition-colors"
          >
            <h3 className="font-display text-base font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-ember/20 bg-ember/5 p-5">
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-foreground font-medium">Important:</strong>{" "}
          High Sierra Fire Defense is a wildfire defense and mitigation system
          designed to help reduce ember ignition risk and support defensible-space
          efforts. It does not guarantee structure survival and is not a
          replacement for evacuation planning, home hardening, or guidance from
          fire professionals.
        </p>
      </div>
    </Section>
  );
}
