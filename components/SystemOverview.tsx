import { Section } from "./ui/Section";
import { Schematic } from "./Schematic";

export function SystemOverview() {
  return (
    <Section id="how-it-works">
      <p className="index-label">01 / How It Works</p>
      <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        It defends in the direction of the fire.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        The home is divided into four zones — north, east, south, west. When fire
        approaches, the system skews toward the windward side: eco-friendly
        retardant mixes with reservoir water, the pump pressurizes the lines, and
        zone solenoids route flow exactly where it&apos;s needed.
      </p>

      <div className="mt-10">
        <Schematic />
      </div>
    </Section>
  );
}
