import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink bg-paper-2">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold text-ink">High Sierra</span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ember">
                Fire Defense
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              Wildfire defense system — concept in development.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Reno · Lake Tahoe · Truckee · Northern Nevada
            </p>
          </div>

          <Link
            href="#signup"
            className="shrink-0 text-sm font-medium text-ember hover:text-ember-hover"
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
          © {new Date().getFullYear()} High Sierra Fire Defense.
        </p>
      </div>
    </footer>
  );
}
