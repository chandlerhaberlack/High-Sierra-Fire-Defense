import { Section } from "./ui/Section";

const steps = [
  {
    number: "01",
    title: "Harden the Home",
    description:
      "Identify vulnerable exterior zones: roof edges, eaves, decks, vents, fences, vegetation, and perimeter exposure. Map each zone to the system's coverage plan.",
  },
  {
    number: "02",
    title: "Pre-Wet Critical Zones",
    description:
      "When wildfire risk increases, the system can activate exterior water zones to wet surfaces and reduce ignition vulnerability from embers and radiant heat.",
  },
  {
    number: "03",
    title: "Monitor and Maintain Readiness",
    description:
      "The controller tracks system status, water availability, valves, pressure, connectivity, and power — so you know whether the system is ready before fire season.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" topo>
      <div className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
          Process
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          A three-stage approach to exterior wildfire defense — from zone
          identification through active pre-wetting to ongoing readiness
          monitoring.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.number} className="relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-teal/40 to-transparent" />
            )}
            <div className="text-center md:text-left">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-teal/30 bg-teal/10 font-mono text-lg text-teal">
                {step.number}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
