type BadgeVariant = "default" | "teal" | "ember" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface border-surface-border text-muted",
  teal: "bg-teal/10 border-teal/30 text-teal",
  ember: "bg-ember/10 border-ember/30 text-ember",
  muted: "bg-surface/80 border-surface-border text-muted",
};

export function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider border rounded ${variants[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "teal"
              ? "bg-teal animate-pulse"
              : variant === "ember"
                ? "bg-ember"
                : "bg-muted"
          }`}
        />
      )}
      {children}
    </span>
  );
}
