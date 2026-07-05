import { EmberField } from "./EmberField";
import { AnimateIn } from "./ui/AnimateIn";
import { SignupForm } from "./SignupForm";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="early-access"
      className="contour relative overflow-hidden scroll-mt-16"
    >
      {/* Glow rises from the bottom — closing bookend to the hero's top glow. */}
      <div
        className="ember-glow-bottom pointer-events-none absolute inset-0"
        aria-hidden
      />
      <EmberField />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-32 lg:px-8">
        <div className="rule mb-14" />
        <AnimateIn>
          <div className="mx-auto max-w-xl text-center">
            <p className="index-label">06 / Early Access</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Fire season doesn&apos;t wait. Neither should you.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Join the early access list for build updates and pilot
              opportunities across {site.region.label}.
            </p>
            <div className="plate-glow mx-auto mt-10 max-w-sm p-6 text-left">
              <SignupForm />
              <p className="mt-3 text-center text-xs text-ink-muted">
                Updates for {site.region.label}. No spam.
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
