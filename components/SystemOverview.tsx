import { Section } from "./ui/Section";
import { FireSimulator } from "./FireSimulator";

const steps = [
  {
    n: "A",
    title: "You set the fire direction",
    copy: "Point the system at where the fire is coming from — north, east, south, or west. Deployment skews to that bearing.",
  },
  {
    n: "B",
    title: "Three zones deploy",
    copy: "Windward and flanking zones open; the leeward zone holds in reserve. Water is never wasted on the safe side.",
  },
  {
    n: "C",
    title: "City water, then reservoir",
    copy: "The system runs on the city main until municipal supply fails — then switches to the on-site reservoir and pump without missing a beat.",
  },
];

export function SystemOverview() {
  return (
    <Section id="how-it-works" contour wide>
      <p className="index-label">02 / How It Works</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        It defends in the direction of the fire.
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        The perimeter is divided into four zones — north, east, south, west —
        each with its own solenoid valve. Bio-safe retardant injects into the
        water stream, the pump pressurizes the lines, and the controller routes
        flow exactly where the fire is coming from. Try it: pick a direction.
      </p>

      <div className="mt-10">
        <FireSimulator />
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
