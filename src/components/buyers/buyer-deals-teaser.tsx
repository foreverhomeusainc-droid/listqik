"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import type { BuyerDealTeaser } from "@/lib/buyers/types";

export function BuyerDealsTeaser({
  title = "Investor buyer deals",
  subtitle = "MLS-sourced opportunities ranked for flippers, wholesalers, and buy-and-hold operators.",
  limit = 4,
  showCta = true,
  buyersPageHref = "/buyers",
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  showCta?: boolean;
  buyersPageHref?: string;
}) {
  const [deals, setDeals] = useState<BuyerDealTeaser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/buyers/teaser?limit=${limit}`, { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; deals?: BuyerDealTeaser[] };
        if (data.deals) setDeals(data.deals);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Buyer intelligence
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-50 sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">{subtitle}</p>
        </div>
        {showCta ? (
          <Link
            href={buyersPageHref}
            className="inline-flex shrink-0 justify-center rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
          >
            View buyer deals
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading featured deals...</p>
      ) : deals.length === 0 ? (
        <p className="text-sm text-white/50">No teaser deals available yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deals.map((deal) => (
            <BuyerDealCard key={deal.id} deal={deal} mode="teaser" href={buyersPageHref} />
          ))}
        </div>
      )}

      <p className="text-xs text-white/45">
        Teaser view only. Full MLS fields, private remarks, and comps require a signed Buyer
        Representation Agreement with Central Metro Realty.
      </p>
    </section>
  );
}
