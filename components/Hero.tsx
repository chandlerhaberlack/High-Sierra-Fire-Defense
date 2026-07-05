import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { SignupForm } from "./SignupForm";

export function Hero() {
  return (
    <section id="signup" className="relative contour">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">

        {/* ── Desktop: text left, image right ── */}
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">

          {/* Copy + form */}
          <div className="flex flex-col justify-center">
            <p className="index-label">Early Access · Concept in Development</p>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3rem]">
              {site.tagline}
            </h1>

            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-muted">
              Embers arrive before the flames do. Once you evacuate, your home is
              on its own. We&apos;re building an exterior defense system that
              stays behind and fights.
            </p>

            {/* Form */}
            <div className="mt-8 max-w-sm">
              <SignupForm />
            </div>

            <p className="mt-3 text-xs text-ink-muted">
              Updates &amp; pilot opportunities for {site.region.label}. No spam.
            </p>

            <Link
              href="#how-it-works"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ember transition-colors"
            >
              See how it works
              <span aria-hidden>↓</span>
            </Link>
          </div>

          {/* Image — hidden on mobile, shown from lg up */}
          <figure className="hidden lg:block">
            <div
              className="plate relative w-full overflow-hidden"
              style={{ aspectRatio: "3 / 4" }}
            >
              <Image
                src="/images/hero-bg.jpg"
                alt="Ponderosa pine forest at sunset with smoky golden light near Lake Tahoe, Northern Nevada — mountain wildfire terrain"
                fill
                priority
                className="object-cover object-center"
                sizes="420px"
              />
            </div>
            <figcaption className="mt-2 flex items-center justify-between text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted">
              <span>{site.region.caption}</span>
              <span>Northern Nevada</span>
            </figcaption>
          </figure>
        </div>

        {/* Image — shown on mobile below the form, hidden on lg */}
        <figure className="mt-10 lg:hidden">
          <div
            className="plate relative w-full overflow-hidden"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt="Ponderosa pine forest at sunset with smoky golden light near Lake Tahoe, Northern Nevada"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 0px"
            />
          </div>
          <figcaption className="mt-2 flex items-center justify-between text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted">
            <span>{site.region.caption}</span>
            <span>Northern Nevada</span>
          </figcaption>
        </figure>

      </div>
    </section>
  );
}
