import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background/80">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-teal/40 bg-teal/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-sm font-semibold text-foreground">
                High Sierra Fire Defense
              </span>
            </div>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Wildfire defense system currently in development.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
              Service Area
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Reno, Tahoe, Truckee, Northern Nevada, Sierra Nevada foothills
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
              Early Access
            </h3>
            <Link
              href="#waitlist"
              className="text-sm text-teal hover:text-teal/80 transition-colors"
            >
              Join the early access list →
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-8">
          <p className="text-xs text-muted/70 leading-relaxed max-w-3xl">
            <strong className="text-muted">Disclaimer:</strong> This system is
            intended to support wildfire mitigation and exterior pre-wetting. It
            does not guarantee structure survival and is not a replacement for
            defensible space, home hardening, evacuation planning, or guidance
            from fire professionals.
          </p>
          <p className="mt-4 text-xs text-muted/50">
            © {new Date().getFullYear()} High Sierra Fire Defense. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
