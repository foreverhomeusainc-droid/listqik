import type { ReactNode } from "react";

type CockpitBackdropPanelProps = {
  children: ReactNode;
  className?: string;
};

/** Plan grid / hero panel with cockpit background image and gradient scrim. */
export function CockpitBackdropPanel({ children, className = "" }: CockpitBackdropPanelProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-emerald-500/25 p-3 sm:p-4 lg:p-5",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/cockpit-homepage.webp')] bg-cover bg-center opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/25"
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
