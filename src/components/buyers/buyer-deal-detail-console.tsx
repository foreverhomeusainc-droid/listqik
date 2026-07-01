"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import { CompsTool } from "@/components/buyers/comps-tool";
import type { BuyerDealFull } from "@/lib/buyers/types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function BuyerDealDetailConsole({ dealId }: { dealId: string }) {
  const [deal, setDeal] = useState<BuyerDealFull | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [dealRes, watchRes] = await Promise.all([
          fetch(`/api/buyers/deals/${dealId}`, { cache: "no-store" }),
          fetch("/api/buyers/watchlist", { cache: "no-store" }),
        ]);
        const dealData = (await dealRes.json()) as { ok?: boolean; deal?: BuyerDealFull; error?: string };
        const watchData = (await watchRes.json()) as { ok?: boolean; dealIds?: string[] };

        if (!dealRes.ok || !dealData.ok || !dealData.deal) {
          setError(dealData.error ?? "Deal not found.");
          setLoading(false);
          return;
        }
        setDeal(dealData.deal);
        if (watchData.ok && watchData.dealIds) {
          setSaved(watchData.dealIds.includes(dealId));
        }
      } catch {
        setError("Could not load deal.");
      } finally {
        setLoading(false);
      }
    })();
  }, [dealId]);

  async function toggleSave(next: boolean) {
    const res = await fetch("/api/buyers/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId, action: next ? "add" : "remove" }),
    });
    const data = (await res.json()) as { ok?: boolean; dealIds?: string[] };
    if (data.ok) setSaved(next);
  }

  if (loading) return <p className="text-sm text-white/50">Loading deal…</p>;
  if (error || !deal) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-rose-200">{error ?? "Deal not found."}</p>
        <Link href="/dashboard/buyers" className="text-sm text-emerald-300 hover:underline">
          ← Back to buyer feed
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/buyers" className="text-sm text-emerald-300/90 transition hover:text-emerald-200">
          ← Back to feed
        </Link>
        <button
          type="button"
          onClick={() => void toggleSave(!saved)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            saved
              ? "border-amber-400/50 bg-amber-950/40 text-amber-100"
              : "border-white/20 text-white/80 hover:border-amber-400/40"
          }`}
        >
          {saved ? "★ Saved" : "☆ Save to watchlist"}
        </button>
      </div>

      <BuyerDealCard
        deal={deal}
        mode="full"
        street={deal.street}
        privateRemarks={deal.privateRemarks}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-black/35 p-4">
          <p className="text-xs uppercase tracking-wide text-white/50">MLS</p>
          <p className="mt-1 font-semibold text-emerald-50">
            {deal.mlsName} #{deal.mlsNumber}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/35 p-4">
          <p className="text-xs uppercase tracking-wide text-white/50">Investor score</p>
          <p className="mt-1 text-2xl font-semibold text-lime-300">{deal.investorScore}</p>
        </div>
        {deal.rentEstimateMonthly ? (
          <div className="rounded-xl border border-white/10 bg-black/35 p-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Rent estimate</p>
            <p className="mt-1 font-semibold text-emerald-50">{money(deal.rentEstimateMonthly)}/mo</p>
          </div>
        ) : null}
        {deal.soldPrice ? (
          <div className="rounded-xl border border-white/10 bg-black/35 p-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Sold</p>
            <p className="mt-1 font-semibold text-emerald-50">
              {money(deal.soldPrice)}
              {deal.soldDate ? ` · ${deal.soldDate}` : ""}
            </p>
          </div>
        ) : null}
      </div>

      {deal.drivingDirections ? (
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">Directions</p>
          <p className="mt-2 text-sm text-white/80">{deal.drivingDirections}</p>
        </div>
      ) : null}

      <CompsTool
        dealId={deal.id}
        initialZip={deal.zip}
        initialBeds={deal.beds ?? 3}
        initialBaths={deal.baths ?? 2}
        initialSqft={deal.sqft ?? 1500}
        source="buyer-deal-detail"
      />
    </div>
  );
}
