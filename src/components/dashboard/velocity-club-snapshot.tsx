"use client";

import Link from "next/link";
import type { VelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function tierBadgeClass(tierId: VelocityClubSnapshot["tierId"]) {
  switch (tierId) {
    case "mogul":
      return "border-amber-400/50 bg-amber-950/40 text-amber-100";
    case "titan":
      return "border-violet-400/50 bg-violet-950/40 text-violet-100";
    case "syndicate":
      return "border-sky-400/50 bg-sky-950/40 text-sky-100";
    default:
      return "border-emerald-400/40 bg-emerald-950/30 text-emerald-100";
  }
}

export function VelocityClubSnapshotCard({
  snapshot,
  compact = false,
  showClubLink = true,
}: {
  snapshot: VelocityClubSnapshot;
  compact?: boolean;
  showClubLink?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-emerald-500/25 bg-black/45 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Velocity Club
          </p>
          <h2 className="mt-1 text-xl font-semibold text-emerald-50">Investor Snapshot</h2>
        </div>
        <span
          className={`max-w-full shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase leading-tight tracking-wide sm:text-xs ${tierBadgeClass(snapshot.tierId)}`}
        >
          {snapshot.tierName}
        </span>
      </div>

      <p className="mt-2 text-sm text-white/65">{snapshot.tierTagline}</p>

      <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}>
        <Stat label="MLS (12 mo)" value={String(snapshot.counts.mlsListings12mo)} />
        <Stat label="Rentals (12 mo)" value={String(snapshot.counts.rentalListings12mo)} />
        <Stat label="Credits bank" value={String(snapshot.unusedCredits)} />
        <Stat label="Velocity score" value={String(snapshot.velocityScore)} />
        <Stat label="Net savings" value={formatMoney(snapshot.savings.netSavingsUsd)} accent />
        {!compact ? (
          <Stat label="Lifetime listings" value={String(snapshot.counts.lifetimeListings)} />
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-1 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span className="min-w-0">
            {snapshot.nextTierName
              ? `Progress to ${snapshot.nextTierName}`
              : "Maximum tier unlocked"}
          </span>
          <span className="shrink-0">
            {snapshot.nextTierName && snapshot.listingsUntilNext !== null
              ? `${snapshot.listingsUntilNext} to next tier`
              : "100%"}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-300 transition-all"
            style={{ width: `${snapshot.progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/50">
          Effective count: {snapshot.effectiveCount} (rolling listings + unused credits)
        </p>
      </div>

      {snapshot.fastTrackTrialActive ? (
        <p className="mt-4 rounded-lg border border-lime-400/30 bg-lime-950/20 px-3 py-2 text-sm text-lime-100/90">
          Fast-Track trial active — your next listing jumps the compliance queue.
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {showClubLink ? (
          <Link
            href="/dashboard/velocity-club"
            className="rounded-full border border-emerald-400/60 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
          >
            Open Velocity Club
          </Link>
        ) : null}
        <SavingsBreakdown snapshot={snapshot} />
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
      <p className="text-[11px] uppercase tracking-wide text-white/50">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${accent ? "text-lime-300" : "text-emerald-50"}`}>
        {value}
      </p>
    </div>
  );
}

function SavingsBreakdown({ snapshot }: { snapshot: VelocityClubSnapshot }) {
  return (
    <details className="text-sm text-white/70">
      <summary className="cursor-pointer list-none rounded-full border border-white/15 px-4 py-2 font-medium text-white/80 transition hover:border-white/30">
        Savings breakdown
      </summary>
      <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-3 text-xs leading-relaxed">
        <p>Traditional 3% commissions avoided: {formatMoney(snapshot.savings.traditionalCommissionsAvoidedUsd)}</p>
        <p className="mt-1">ListQik fees paid: {formatMoney(snapshot.savings.listQikFeesPaidUsd)}</p>
        <p className="mt-1 font-semibold text-lime-200">
          Net margin defended: {formatMoney(snapshot.savings.netSavingsUsd)}
        </p>
      </div>
    </details>
  );
}
