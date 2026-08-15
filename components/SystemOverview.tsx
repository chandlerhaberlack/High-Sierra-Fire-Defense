import { Section } from "./ui/Section";
import { BrainSimulator } from "./BrainSimulator";
import { system } from "@/lib/site";

const steps = [
  {
    n: "A",
    title: "It watches — three ways",
    copy: "Eight melt-wire thermal nodes ring the property line, an ambient air sensor tracks how fast the air is heating, and two thermal cameras each sweep half the horizon. Three independent layers, so no single glitch can fool it.",
  },
  {
    n: "B",
    title: "It arms itself as danger rises",
    copy: "The central computer knows its GPS position and watches WatchDuty and red flag warnings. Normal day: all three layers must agree. Evacuation warning: two. GO NOW order: a single detection deploys — instantly.",
  },
  {
    n: "C",
    title: "It deploys — and tells you everything",
    copy: "The pump pushes bio-safe retardant from the on-site reservoir through all four perimeter zones, coating the roofline and defensible space. Every step lands on your phone by SMS — and you can bypass it all and deploy manually, anytime.",
  },
];

export function SystemOverview() {
  return (
    <Section id="how-it-works" contour wide glow="left">
      <p className="index-label">02 / How It Works</p>

      <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        One central computer. Three ways of seeing fire.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        {system.summary} Watch the fire simulation below arm the system step by
        step — or switch to explore mode, where every piece is tappable.
      </p>

      <div className="mt-10">
        <BrainSimulator />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="border-t border-line pt-5">
            <p className="font-mono text-xs font-bold text-ember">{s.n}</p>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
