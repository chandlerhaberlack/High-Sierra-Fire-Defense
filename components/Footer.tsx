import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-ink-muted">
              Exterior wildfire defense for mountain homes — concept in development.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {site.region.places.join(" · ")}
            </p>
          </div>

          <Link
            href="#signup"
            className="shrink-0 text-sm font-medium text-ember transition-colors hover:text-ember-glow"
          >
            Join the early access list →
          </Link>
        </div>

        <div className="rule my-8" />

        <p className="max-w-3xl text-xs leading-relaxed text-ink-muted">
          <strong className="text-ink">Disclaimer:</strong> This system is intended
          to support wildfire mitigation and exterior pre-wetting. It does not
          guarantee structure survival and is not a replacement for defensible
          space, home hardening, evacuation planning, or guidance from fire
          professionals.
        </p>
        <p className="mt-4 text-xs text-ink-muted/70">
          © {new Date().getFullYear()} {site.name}.
        </p>
      </div>
    </footer>
  );
}
