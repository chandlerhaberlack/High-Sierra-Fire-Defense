import { Section } from "./ui/Section";

const communities = [
  "Reno",
  "Truckee",
  "Carson Valley",
  "Galena",
  "Somersett",
  "Verdi",
  "Incline Village",
  "South Lake Tahoe",
];

export function LocalFocus() {
  return (
    <Section id="service-area" grid>
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
            Service Area
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for the Sierra Wildland-Urban Interface
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Communities across the Sierra Nevada foothills face a unique mix of
            dry fuels, high winds, steep terrain, evacuation constraints, and
            increasing insurance scrutiny. High Sierra Fire Defense is being
            designed for homeowners who need practical, engineered exterior
            protection — not generic solutions built for flatland suburbs.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Whether you need{" "}
            <span className="text-foreground">wildfire defense in Reno</span>,
            a{" "}
            <span className="text-foreground">
              wildfire sprinkler system in Tahoe
            </span>
            , or{" "}
            <span className="text-foreground">
              home wildfire protection in Truckee
            </span>
            , this system is being developed for the specific conditions of
            mountain and foothill properties throughout Northern Nevada and the
            Sierra.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-surface-border bg-surface/60 p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Communities We Serve
            </h3>
            <div className="flex flex-wrap gap-2">
              {communities.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 text-sm text-muted bg-background/60 border border-surface-border rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface/40 p-6 space-y-3">
            <h3 className="font-display text-sm font-semibold text-foreground">
              Regional Challenges
            </h3>
            {[
              "Dry fuels and high-wind ember transport",
              "Steep terrain limiting manual defense",
              "Extended evacuation windows",
              "Insurance and hardening requirements",
              "Second-home readiness when away",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-teal mt-0.5">›</span>
                {item}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted/70 leading-relaxed">
            Serving homeowners seeking exterior wildfire mitigation in Nevada,
            defensible space water system support across the Sierra Nevada, and
            smart wildfire defense system solutions for mountain properties.
          </p>
        </div>
      </div>
    </Section>
  );
}
