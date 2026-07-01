"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import { CompsTool } from "@/components/buyers/comps-tool";
import type { BuyerAccess, BuyerDealFilters, BuyerDealFull } from "@/lib/buyers/types";

type Tab = "feed" | "watchlist";

const SORT_OPTIONS: { value: BuyerDealFilters["sort"]; label: string }[] = [
  { value: "score", label: "Investor score" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "dom", label: "Days on market" },
];

function buildDealsUrl(filters: BuyerDealFilters): string {
  const params = new URLSearchParams();
  if (filters.zip) params.set("zip", filters.zip);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.status) params.set("status", filters.status);
  if (filters.minScore != null) params.set("minScore", String(filters.minScore));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort) params.set("sort", filters.sort);
  const q = params.toString();
  return q ? `/api/buyers/deals?${q}` : "/api/buyers/deals";
}

export function BuyersConsole() {
  const [access, setAccess] = useState<BuyerAccess | null>(null);
  const [tab, setTab] = useState<Tab>("feed");
  const [deals, setDeals] = useState<BuyerDealFull[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BuyerDealFilters>({ sort: "score" });

  const loadWatchlist = useCallback(async () => {
    const res = await fetch("/api/buyers/watchlist", { cache: "no-store" });
    const data = (await res.json()) as {
      ok?: boolean;
      deals?: BuyerDealFull[];
      dealIds?: string[];
    };
    if (data.ok) {
      setWatchlistIds(new Set(data.dealIds ?? []));
      return data.deals ?? [];
    }
    return [];
  }, []);

  const loadFeed = useCallback(async (activeFilters: BuyerDealFilters) => {
    const res = await fetch(buildDealsUrl(activeFilters), { cache: "no-store" });
    const data = (await res.json()) as {
      ok?: boolean;
      deals?: BuyerDealFull[];
      lastSyncedAt?: string | null;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "Could not load buyer deals.");
    }
    setLastSyncedAt(data.lastSyncedAt ?? null);
    return data.deals ?? [];
  }, []);

  const refresh = useCallback(
    async (activeFilters: BuyerDealFilters, activeTab: Tab) => {
      setRefreshing(true);
      setError(null);
      try {
        const [feedDeals, watchlistDeals] = await Promise.all([loadFeed(activeFilters), loadWatchlist()]);
        setDeals(activeTab === "watchlist" ? watchlistDeals : feedDeals);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not refresh deals.");
      } finally {
        setRefreshing(false);
      }
    },
    [loadFeed, loadWatchlist],
  );

  useEffect(() => {
    void (async () => {
      try {
        const accessRes = await fetch("/api/buyers/access", { cache: "no-store" });
        const accessData = (await accessRes.json()) as { ok?: boolean; access?: BuyerAccess };
        if (accessData.access) setAccess(accessData.access);

        if (!accessData.access?.canViewFullDeals) {
          setLoading(false);
          return;
        }

        const [feedDeals] = await Promise.all([loadFeed({ sort: "score" }), loadWatchlist()]);
        setDeals(feedDeals);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load buyer deals.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadFeed, loadWatchlist]);

  async function toggleWatchlist(dealId: string, saved: boolean) {
    const res = await fetch("/api/buyers/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId, action: saved ? "add" : "remove" }),
    });
    const data = (await res.json()) as { ok?: boolean; dealIds?: string[] };
    if (data.ok && data.dealIds) {
      setWatchlistIds(new Set(data.dealIds));
      if (tab === "watchlist") {
        const watchlistDeals = await loadWatchlist();
        setDeals(watchlistDeals);
      }
    }
  }

  function applyFilters() {
    void refresh(filters, tab);
  }

  async function switchTab(next: Tab) {
    setTab(next);
    setRefreshing(true);
    try {
      if (next === "watchlist") {
        const watchlistDeals = await loadWatchlist();
        setDeals(watchlistDeals);
      } else {
        const feedDeals = await loadFeed(filters);
        setDeals(feedDeals);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load deals.");
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-white/50">Loading buyer intelligence...</p>;
  }

  if (!access?.hasBuyerRep) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-950/20 p-6">
        <h2 className="text-lg font-semibold text-amber-100">Buyer Representation required</h2>
        <p className="mt-2 text-sm text-amber-100/80">
          Sign the Buyer Rep agreement to unlock the full MLS deal feed, private remarks, and comps
          engine.
        </p>
        <Link
          href="/buyer-representation"
          className="mt-4 inline-flex rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-900/30"
        >
          Sign Buyer Rep agreement
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void switchTab("feed")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "feed"
                ? "border border-emerald-400/60 bg-emerald-500/20 text-emerald-50"
                : "border border-white/15 text-white/70 hover:border-white/30"
            }`}
          >
            MLS feed
          </button>
          <button
            type="button"
            onClick={() => void switchTab("watchlist")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "watchlist"
                ? "border border-emerald-400/60 bg-emerald-500/20 text-emerald-50"
                : "border border-white/15 text-white/70 hover:border-white/30"
            }`}
          >
            Watchlist ({watchlistIds.size})
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/50">
          {lastSyncedAt ? (
            <span>Last MLS sync {new Date(lastSyncedAt).toLocaleString()}</span>
          ) : null}
          <button
            type="button"
            disabled={refreshing}
            onClick={() => void refresh(filters, tab)}
            className="rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white/80 transition hover:border-emerald-400/40 disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {tab === "feed" ? (
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">Filters</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">ZIP prefix</span>
              <input
                value={filters.zip ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, zip: e.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
                placeholder="752"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">Tag</span>
              <input
                value={filters.tag ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
                placeholder="brrrr"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">Status</span>
              <select
                value={filters.status ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    status: (e.target.value || undefined) as BuyerDealFilters["status"],
                  }))
                }
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              >
                <option value="">Any</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">Min score</span>
              <input
                type="number"
                min={0}
                value={filters.minScore ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    minScore: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">Max price</span>
              <input
                type="number"
                min={0}
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/60">Sort</span>
              <select
                value={filters.sort ?? "score"}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sort: e.target.value as BuyerDealFilters["sort"],
                  }))
                }
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="mt-4 rounded-full border border-lime-400/50 bg-lime-500/15 px-4 py-2 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/25"
          >
            Apply filters
          </button>
        </div>
      ) : null}

      <CompsTool source="buyer-dashboard" />

      <div>
        <h2 className="text-lg font-semibold text-emerald-50">
          {tab === "watchlist" ? "Saved deals" : "MLS buyer deals"}
        </h2>
        <p className="mt-1 text-sm text-white/65">
          {tab === "watchlist"
            ? "Deals you starred for follow-up."
            : "Full feed with investor scoring, DOM, and broker-only remarks."}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => (
            <BuyerDealCard
              key={deal.id}
              deal={deal}
              mode="full"
              href={`/dashboard/buyers/${deal.id}`}
              street={deal.street}
              privateRemarks={deal.privateRemarks}
              saved={watchlistIds.has(deal.id)}
              onToggleSave={(saved) => void toggleWatchlist(deal.id, saved)}
            />
          ))}
        </div>
        {deals.length === 0 ? (
          <p className="mt-4 text-sm text-white/50">
            {tab === "watchlist" ? "No saved deals yet — star a listing from the feed." : "No deals match your filters."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
