type LogoProps = {
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: 28, text: "text-base" },
  md: { mark: 36, text: "text-lg" },
  lg: { mark: 44, text: "text-xl" },
};

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 2L44 12V36L24 46L4 36V12L24 2Z"
        stroke="#e85a24"
        strokeWidth="1.5"
        fill="#1c1814"
      />
      <path
        d="M24 2L44 12V36L24 46L4 36V12L24 2Z"
        fill="url(#emberGrad)"
        fillOpacity="0.15"
      />
      <path
        d="M16 14L32 34M32 14L16 34"
        stroke="#e85a24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3" fill="#ff7a3d" opacity="0.9">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <defs>
        <radialGradient id="emberGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ff7a3d" />
          <stop offset="100%" stopColor="#e85a24" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Logo({ showWordmark = true, size = "md" }: LogoProps) {
  const s = sizes[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={s.mark} />
      {showWordmark && (
        <span className={`${s.text} leading-none tracking-tight`}>
          <span className="font-display font-semibold text-ink">EmberX</span>{" "}
          <span className="text-[0.65em] font-semibold uppercase tracking-[0.2em] text-ember">
            Defense
          </span>
        </span>
      )}
    </span>
  );
}
