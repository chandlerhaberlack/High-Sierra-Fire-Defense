"use client";

import { useEffect, useRef } from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  topo?: boolean;
  grid?: boolean;
  reveal?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  topo = false,
  grid = false,
  reveal = true,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!reveal || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const el = ref.current;
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [reveal]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-20 md:py-28 ${topo ? "topo-bg" : ""} ${grid ? "grid-overlay" : ""} ${reveal ? "reveal" : ""} ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">{children}</div>
    </section>
  );
}
