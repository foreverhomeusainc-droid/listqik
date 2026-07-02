"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import type { BuyerDealTeaser } from "@/lib/buyers/types";

function dealLabelFor(deal: BuyerDealTeaser, index: number): string {
  if (deal.dealFeatured && index === 0) return "Deal of the Week";
  return `Deal ${index + 1}`;
}

export function FeaturedBuyerDeals({
  eyebrow = "Deals of the Week",
  title = "Hand-picked MLS deals",
  subtitle = "Each listing shows list price next to approximate market value so you can see the gap — not just a teaser.",
  limit = 4,
  showCta = true,
  buyersPageHref = "/buyers",
  showArv = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  showCta?: boolean;
  buyersPageHref?: string;
  showArv?: boolean;
}) {
  const [deals, setDeals] = useState<BuyerDealTeaser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/buyers/featured-deals?limit=${limit}`, { cache: "no-store" });
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
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-50 sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">{subtitle}</p>
        </div>
        {showCta ? (
          <Link
            href={buyersPageHref}
            className="inline-flex shrink-0 justify-center rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
          >
            View all buyer deals
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading deals...</p>
      ) : deals.length === 0 ? (
        <p className="text-sm text-white/50">
          No featured deals yet. Check back soon — we add new MLS picks each week.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deals.map((deal, index) => (
            <BuyerDealCard
              key={deal.id}
              deal={deal}
              mode="preview"
              href={buyersPageHref}
              showArv={showArv}
              showMarketValue={!showArv}
              dealLabel={dealLabelFor(deal, index)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-white/45">
        Approximate market value is set by our team after reviewing recent MLS sales — not a
        guarantee of value. Full address, private remarks, and comps require signed Buyer
        Representation with Central Metro Realty.
      </p>
    </section>
  );
}

/** @deprecated Use FeaturedBuyerDeals */
export const BuyerDealsTeaser = FeaturedBuyerDeals;
