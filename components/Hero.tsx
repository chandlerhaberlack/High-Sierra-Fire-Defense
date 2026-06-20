import Image from "next/image";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ScadaPanel } from "./ScadaPanel";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden scan-lines">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Sierra Nevada mountain home at dusk — exterior wildfire defense landscape in Reno Tahoe region"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 grid-overlay opacity-50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="ember" dot className="mb-6">
              Concept Development
            </Badge>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Wildfire Defense for the Modern Mountain Home
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              An intelligent exterior water-defense system designed for Reno,
              Tahoe, Truckee, and Sierra foothill homes exposed to ember storms,
              wind-driven fires, and evacuation uncertainty.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="#waitlist" variant="primary">
                Join the Early Access List
              </Button>
              <Button href="#how-it-works" variant="secondary">
                See How It Works
              </Button>
            </div>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted/80">
              Currently in concept development. Join for updates, pilot
              opportunities, and wildfire defense research.
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-xl bg-teal/5 blur-2xl" />
            <ScadaPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
