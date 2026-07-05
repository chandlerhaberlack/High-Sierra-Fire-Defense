import { Section } from "./ui/Section";
import { AnimateIn } from "./ui/AnimateIn";
import { hardwareSpecs } from "@/lib/site";

export function Hardware() {
  return (
    <Section id="hardware" wide>
      <p className="index-label">03 / The Hardware</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        Simple parts. No grid required.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Every component is chosen to keep working when everything else fails —
        power outages, water shutoffs, evacuation orders.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {hardwareSpecs.map((spec, i) => (
          <AnimateIn key={spec.title} delay={i * 0.08}>
            <div className="group h-full border border-line bg-paper-2 p-6 transition-colors hover:border-ember/40">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-ink">{spec.title}</h3>
                <span className="shrink-0 border border-ember/30 bg-ember/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-ember">
                  {spec.stat}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{spec.detail}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </Section>
  );
}
