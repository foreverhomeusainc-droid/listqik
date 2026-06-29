"use client";

import { useState } from "react";

export function AdminListingSiteControls({
  listingId,
  slug,
  publishedOnSite,
  dealOfTheWeek,
  dealOfTheWeekRank,
}: {
  listingId: string;
  slug?: string | null;
  publishedOnSite: boolean;
  dealOfTheWeek: boolean;
  dealOfTheWeekRank?: number;
}) {
  const [published, setPublished] = useState(publishedOnSite);
  const [deal, setDeal] = useState(dealOfTheWeek);
  const [rank, setRank] = useState(dealOfTheWeekRank ?? 0);
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
        listing?: { slug?: string; publicUrl?: string };
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Update failed.");
        return false;
      }
      if (data.listing?.slug) setPublicSlug(data.listing.slug);
      return true;
    } catch {
      setError("Network error.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 text-xs">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          disabled={busy}
          onChange={(e) => {
            const next = e.target.checked;
            void patch({ publishedOnSite: next }).then((ok) => ok && setPublished(next));
          }}
          className="accent-emerald-500"
        />
        <span className="text-white/80">On listqik.com/listings</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={deal}
          disabled={busy || !published}
          onChange={(e) => {
            const next = e.target.checked;
            void patch({ dealOfTheWeek: next, dealOfTheWeekRank: rank }).then((ok) => ok && setDeal(next));
          }}
          className="accent-amber-500"
        />
        <span className="text-amber-100/90">Deal of the Week</span>
      </label>
      {deal ? (
        <div className="flex items-center gap-1 pl-5">
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
      {error ? <p className="text-rose-300">{error}</p> : null}
    </div>
  );
}
