import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 rounded-md";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ember text-white hover:bg-ember-hover shadow-lg shadow-ember/20 hover:shadow-ember/30",
  secondary:
    "border border-surface-border text-foreground hover:border-teal hover:text-teal bg-surface/50",
};

export function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  onClick,
  disabled,
  className = "",
}: ButtonProps) {
  const styles = `${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {children}
    </button>
  );
}
