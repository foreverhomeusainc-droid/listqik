"use client";

import { useState } from "react";

export function AdminListingSiteControls({
  listingId,
  slug,
  publishedOnSite,
  dealOfTheWeek,
  dealOfTheWeekRank,
  dealOfTheWeekUntil,
}: {
  listingId: string;
  slug?: string | null;
  publishedOnSite: boolean;
  dealOfTheWeek: boolean;
  dealOfTheWeekRank?: number;
  dealOfTheWeekUntil?: string | null;
}) {
  const [published, setPublished] = useState(publishedOnSite);
  const [deal, setDeal] = useState(dealOfTheWeek);
  const [rank, setRank] = useState(dealOfTheWeekRank ?? 0);
  const [dealUntil, setDealUntil] = useState(
    dealOfTheWeekUntil ? dealOfTheWeekUntil.slice(0, 10) : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicSlug, setPublicSlug] = useState(slug ?? "");

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        listing?: {
          slug?: string;
          publicUrl?: string;
          publishedOnSite?: boolean;
          dealOfTheWeek?: boolean;
        };
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Update failed.");
        return false;
      }
      if (data.listing?.slug) setPublicSlug(data.listing.slug);
      if (typeof data.listing?.publishedOnSite === "boolean") {
        setPublished(data.listing.publishedOnSite);
      }
      if (typeof data.listing?.dealOfTheWeek === "boolean") {
        setDeal(data.listing.dealOfTheWeek);
      }
      return true;
    } catch {
      setError("Network error.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const dealHidden = deal && !published;

  return (
    <div className="space-y-2 text-xs">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          disabled={busy}
          onChange={(e) => {
            const next = e.target.checked;
            void patch({ publishedOnSite: next }).then((ok) => {
              if (!ok) return;
              setPublished(next);
              if (!next) setDeal(false);
            });
          }}
          className="accent-emerald-500"
        />
        <span className="text-white/80">On listqik.com/listings</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={deal}
          disabled={busy}
          onChange={(e) => {
            const next = e.target.checked;
            void patch({
              dealOfTheWeek: next,
              dealOfTheWeekRank: rank,
              ...(next ? { publishedOnSite: true } : {}),
            }).then((ok) => {
              if (!ok) return;
              setDeal(next);
              if (next) setPublished(true);
            });
          }}
          className="accent-amber-500"
        />
        <span className="text-amber-100/90">Deal of the Week</span>
      </label>
      {dealHidden ? (
        <p className="text-amber-200/80">
          Hidden — check &quot;On listqik.com/listings&quot; to show on the site.
        </p>
      ) : null}
      {deal ? (
        <div className="space-y-1 pl-5">
          <div className="flex items-center gap-1">
            <span className="text-white/45">Rank</span>
            <input
              type="number"
              min={0}
              max={99}
              value={rank}
              disabled={busy}
              onChange={(e) => setRank(parseInt(e.target.value, 10) || 0)}
              onBlur={() => void patch({ dealOfTheWeekRank: rank })}
              className="w-12 rounded border border-white/15 bg-black/40 px-1 py-0.5 text-white"
            />
          </div>
          <label className="flex flex-col gap-0.5 text-white/45">
            <span>Featured until (optional)</span>
            <input
              type="date"
              value={dealUntil}
              disabled={busy}
              onChange={(e) => setDealUntil(e.target.value)}
              onBlur={() =>
                void patch({
                  dealOfTheWeekUntil: dealUntil ? new Date(dealUntil).toISOString() : null,
                })
              }
              className="rounded border border-white/15 bg-black/40 px-1 py-0.5 text-white"
            />
          </label>
        </div>
      ) : null}
      {publicSlug && published ? (
        <a
          href={`/listings/${publicSlug}`}
          target="_blank"
          rel="noreferrer"
          className="block text-emerald-300 underline"
        >
          View public
        </a>
      ) : null}
      <p className="text-white/40">
        Shows on homepage, /listings, and /investors — not /buyers.
      </p>
      {error ? <p className="text-rose-300">{error}</p> : null}
    </div>
  );
}
