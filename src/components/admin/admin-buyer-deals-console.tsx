"use client";

import { useEffect, useState } from "react";
import type { BuyerDealAdminRow, BuyerDealReviewStatus } from "@/lib/buyers/types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const STATUS_BADGE: Record<BuyerDealReviewStatus, string> = {
  pending: "border-amber-400/40 bg-amber-950/40 text-amber-100",
  approved: "border-emerald-400/40 bg-emerald-950/40 text-emerald-100",
  rejected: "border-rose-400/40 bg-rose-950/40 text-rose-100",
};

export function AdminBuyerDealsConsole() {
  const [deals, setDeals] = useState<BuyerDealAdminRow[]>([]);
  const [filter, setFilter] = useState<BuyerDealReviewStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/buyer-deals", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; deals?: BuyerDealAdminRow[]; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not load deals.");
        return;
      }
      setDeals(data.deals ?? []);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function patchDeal(
    id: string,
    patch: {
      reviewStatus?: BuyerDealReviewStatus;
      active?: boolean;
      teaserFeatured?: boolean;
    },
  ) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/buyer-deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = (await res.json()) as { ok?: boolean; deal?: BuyerDealAdminRow };
      if (data.ok && data.deal) {
        setDeals((rows) => rows.map((r) => (r.id === id ? data.deal! : r)));
      }
    } finally {
      setBusyId(null);
    }
  }

  const visible =
    filter === "all" ? deals : deals.filter((d) => d.reviewStatus === filter);

  const pendingCount = deals.filter((d) => d.reviewStatus === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                filter === key
                  ? "border border-emerald-400/50 bg-emerald-500/15 text-emerald-50"
                  : "border border-white/15 text-white/60 hover:border-white/30"
              }`}
            >
              {key}
              {key === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80"
        >
          Refresh
        </button>
      </div>

      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      {loading ? <p className="text-sm text-white/50">Loading MLS deals…</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
        <table className="min-w-full text-left text-sm text-white/90">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
            <tr>
              <th className="px-3 py-2">Property</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Review</th>
              <th className="px-3 py-2">Feed</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((deal) => (
              <tr key={deal.id} className="border-t border-white/10">
                <td className="px-3 py-3">
                  <p className="font-medium text-emerald-50">
                    {deal.street ? `${deal.street}, ` : ""}
                    {deal.city}, {deal.state} {deal.zip}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">{deal.externalId || deal.mlsNumber}</p>
                </td>
                <td className="px-3 py-3 font-mono">{money(deal.listPrice)}</td>
                <td className="px-3 py-3">{deal.investorScore}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_BADGE[deal.reviewStatus]}`}
                  >
                    {deal.reviewStatus}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-white/60">
                  {deal.active ? "Active" : "Hidden"}
                  {deal.teaserFeatured ? " · Teaser" : ""}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {deal.reviewStatus === "pending" ? (
                      <>
                        <button
                          type="button"
                          disabled={busyId === deal.id}
                          onClick={() => void patchDeal(deal.id, { reviewStatus: "approved", active: true })}
                          className="rounded border border-emerald-400/40 px-2 py-1 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/30 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === deal.id}
                          onClick={() => void patchDeal(deal.id, { reviewStatus: "rejected", active: false })}
                          className="rounded border border-rose-400/40 px-2 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-900/30 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      disabled={busyId === deal.id}
                      onClick={() =>
                        void patchDeal(deal.id, { teaserFeatured: !deal.teaserFeatured })
                      }
                      className="rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                    >
                      {deal.teaserFeatured ? "Unfeature" : "Teaser"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && visible.length === 0 ? (
          <p className="p-6 text-sm text-white/50">No deals in this queue.</p>
        ) : null}
      </div>
    </div>
  );
}
