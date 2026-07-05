import { Section } from "./ui/Section";
import { SignupForm } from "./SignupForm";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <Section className="contour" divider={false}>
      <div className="ember-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="index-label">Early Access</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Fire season doesn&apos;t wait. Neither should you.
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Join the early access list for build updates and pilot opportunities
          across {site.region.label}.
        </p>
        <div className="mx-auto mt-8 max-w-sm text-left">
          <SignupForm />
        </div>
      </div>
    </Section>
  );
}
