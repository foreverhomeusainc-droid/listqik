"use client";

import { usePathname } from "next/navigation";

export function DashboardTitleBlock() {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const isVelocityClub = pathname.startsWith("/dashboard/velocity-club");
  const isCalculators = pathname.startsWith("/dashboard/calculators");

  if (isAdmin) {
    return (
      <>
        <h1 className="text-balance bg-gradient-to-r from-lime-200 via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Admin console
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Manage accounts, listings, and configuration. Use the sidebar to switch sections.
        </p>
      </>
    );
  }

  if (isCalculators) {
    return (
      <>
        <h1 className="text-balance bg-gradient-to-r from-lime-200 via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Deal Analyzer
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Institutional calculators with Velocity Club gating, Push to Live Listing, and Syndicate+
          Deal Memo export.
        </p>
      </>
    );
  }

  if (isVelocityClub) {
    return (
      <>
        <h1 className="text-balance bg-gradient-to-r from-lime-200 via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Velocity Club
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Your investor snapshot, tier progress, credit bank, and pipeline bundles — built for bulk
          MLS and rental listing velocity.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-balance bg-gradient-to-r from-lime-200 via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
        Listing dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-white/75">
        Manage your MLS-ready listing details, status, documents, offers, upgrades, legal package,
        and publishing workflow.
      </p>
    </>
  );
}
