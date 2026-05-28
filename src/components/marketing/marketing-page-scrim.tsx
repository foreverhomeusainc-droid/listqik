import type { ReactNode } from "react";

/** Shared grid + safe-area wrapper for cockpit marketing pages (/ and /pricing). */
export function MarketingPageScrim({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-w-0 overflow-x-hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg" />
      {children}
    </div>
  );
}
