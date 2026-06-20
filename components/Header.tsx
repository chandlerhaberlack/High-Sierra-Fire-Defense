"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";

const navLinks = [
  { label: "System", href: "#system" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Service Area", href: "#service-area" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-teal/40 bg-teal/10">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-teal"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="ml-2.5">
            <span className="block font-display text-sm font-semibold tracking-tight text-foreground">
              High Sierra
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
              Fire Defense
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button href="#waitlist" variant="primary" className="!py-2 !px-4 !text-xs">
            Early Access
          </Button>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Button href="#waitlist" variant="primary" className="!py-2 !px-3 !text-xs">
            Join List
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-surface-border bg-background/95 px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
