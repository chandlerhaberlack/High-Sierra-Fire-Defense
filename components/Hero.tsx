"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { EmberField } from "./EmberField";
import { SignupForm } from "./SignupForm";

export function Hero() {
  return (
    <section
      id="signup"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden contour"
    >
      <div className="ember-glow pointer-events-none absolute inset-0" aria-hidden />
      <EmberField />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="index-label">Early Access · Concept in Development</p>

          <h1 className="mt-6 max-w-3xl font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {site.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            {site.heroSubhead}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start"
        >
          <div>
            <figure className="plate-glow overflow-hidden">
              <Image
                src="/images/house-fire.png"
                alt="Suburban mountain home with a wildfire burning on the ridgeline behind it"
                width={1024}
                height={576}
                priority
                className="aspect-[16/9] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <figcaption className="border-t border-line px-4 py-2 text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted">
                {site.region.caption}
              </figcaption>
            </figure>

            <Link
              href="#how-it-works"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ember"
            >
              See how the system works
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                aria-hidden
              >
                ↓
              </motion.span>
            </Link>
          </div>

          <div className="plate-glow p-6">
            <p className="index-label mb-4">Get Early Access</p>
            <SignupForm />
            <p className="mt-3 text-xs text-ink-muted">
              Updates for {site.region.label}. No spam.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
