import type { ReactNode } from "react";

type CockpitHudFrameProps = {
  children: ReactNode;
  className?: string;
  padding?: "default" | "compact";
};

export function CockpitHudFrame({
  children,
  className = "",
  padding = "default",
}: CockpitHudFrameProps) {
  const pad =
    padding === "compact" ? "p-4 sm:p-6" : "p-3 sm:p-5 lg:p-8";

  return (
    <div
      className={[
        "cockpit-hud-frame border-emerald-500/20 bg-black/55",
        pad,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
