import { Section } from "./ui/Section";
import { AnimateIn } from "./ui/AnimateIn";
import { site, regionCards } from "@/lib/site";

export function LocalFocus() {
  return (
    <Section id="region" wide>
      <p className="index-label">04 / Region</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        Built for {site.region.label}.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        High-wind, dry-fuel, wildland-urban-interface homes across the eastern
        Sierra face fire exposure that flatland systems weren&apos;t designed for.
        {" "}{site.name} is built for exactly this terrain.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {regionCards.map((card, i) => (
          <AnimateIn key={card.place} delay={i * 0.08}>
            <div className="h-full border border-line bg-paper-2 p-6 transition-colors hover:border-ember/40">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">{card.place}</h3>
                <span className="text-xs uppercase tracking-wider text-ink-muted">{card.state}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.copy}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </Section>
  );
}
