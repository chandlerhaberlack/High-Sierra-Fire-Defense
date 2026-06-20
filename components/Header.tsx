"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Region", href: "#region" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            High Sierra
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ember">
            Fire Defense
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#signup"
            className="bg-ember px-4 py-2 text-xs font-medium tracking-wide text-paper transition-colors hover:bg-ember-hover"
          >
            Early Access
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="#signup"
            className="bg-ember px-3 py-2 text-xs font-medium text-paper"
          >
            Join
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-ink-muted hover:text-ink"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-paper px-6 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-ink-muted hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
