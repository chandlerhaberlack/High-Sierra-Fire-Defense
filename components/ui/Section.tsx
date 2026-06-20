"use client";

import { useEffect, useRef } from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  contour?: boolean;
  divider?: boolean;
  reveal?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  contour = false,
  divider = true,
  reveal = true,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!reveal || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    const el = ref.current;
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [reveal]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-14 md:py-20 ${contour ? "contour" : ""} ${reveal ? "reveal" : ""} ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        {divider && <div className="rule mb-10" />}
        {children}
      </div>
    </section>
  );
}
