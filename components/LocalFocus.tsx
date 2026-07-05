import { Section } from "./ui/Section";
import { site } from "@/lib/site";

export function LocalFocus() {
  return (
    <Section id="region">
      <div className="max-w-2xl">
        <p className="index-label">02 / Region</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Built for {site.region.label}.
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          High-wind, dry-fuel, wildland-urban-interface homes across Reno, Lake
          Tahoe, and Truckee face fire exposure that flatland systems weren&apos;t
          designed for. {site.name} is built for exactly that.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6">
        {site.region.places.map((name) => (
          <span key={name} className="text-sm font-medium tracking-wide text-ink">
            {name}
          </span>
        ))}
      </div>
    </Section>
  );
}
