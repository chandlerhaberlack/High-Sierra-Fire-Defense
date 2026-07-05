import { AnimateIn } from "./AnimateIn";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  contour?: boolean;
  divider?: boolean;
  wide?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  contour = false,
  divider = true,
  wide = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-16 py-16 md:py-24 ${contour ? "contour" : ""} ${className}`}
    >
      <div className={`relative z-10 mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"} px-6 lg:px-8`}>
        {divider && <div className="rule mb-12" />}
        <AnimateIn>{children}</AnimateIn>
      </div>
    </section>
  );
}
