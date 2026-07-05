import { site } from "@/lib/site";

export function Logo() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        {site.namePrimary}
      </span>
      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ember">
        {site.nameSecondary}
      </span>
    </span>
  );
}
