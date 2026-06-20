import { Section } from "./ui/Section";

const places = ["Reno", "Lake Tahoe", "Truckee", "Northern Nevada"];

export function LocalFocus() {
  return (
    <Section id="region">
      <div className="max-w-2xl">
        <p className="index-label">02 / Region</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Built for Reno, Tahoe &amp; Northern Nevada.
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          High-wind, dry-fuel, wildland-urban-interface homes across Reno, Lake
          Tahoe, and Truckee face fire exposure that flatland systems weren&apos;t
          designed for. We&apos;re building something that was.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6">
        {places.map((name) => (
          <span key={name} className="text-sm font-medium tracking-wide text-ink">
            {name}
          </span>
        ))}
      </div>
    </Section>
  );
}
