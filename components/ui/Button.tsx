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

const base =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-150";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ember text-paper hover:bg-ember-hover",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
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
  const styles = `${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
