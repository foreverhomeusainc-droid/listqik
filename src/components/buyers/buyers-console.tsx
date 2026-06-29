"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import { CompsTool } from "@/components/buyers/comps-tool";
import type { BuyerAccess } from "@/lib/buyers/types";
import type { BuyerDealFull } from "@/lib/buyers/types";

export function BuyersConsole() {
  const [access, setAccess] = useState<BuyerAccess | null>(null);
  const [deals, setDeals] = useState<BuyerDealFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compsZip, setCompsZip] = useState("");

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

        const dealsRes = await fetch("/api/buyers/deals", { cache: "no-store" });
        const dealsData = (await dealsRes.json()) as { ok?: boolean; deals?: BuyerDealFull[]; error?: string };
        if (!dealsRes.ok || !dealsData.ok) {
          setError(dealsData.error ?? "Could not load buyer deals.");
          setLoading(false);
          return;
        }
        setDeals(dealsData.deals ?? []);
        setCompsZip(dealsData.deals?.[0]?.zip ?? "");
      } catch {
        setError("Could not load buyer deals.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <CompsTool initialZip={compsZip} />
      <div>
        <h2 className="text-lg font-semibold text-emerald-50">MLS buyer deals</h2>
        <p className="mt-1 text-sm text-white/65">
          Full feed with investor scoring, DOM, and broker-only remarks.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => (
            <BuyerDealCard
              key={deal.id}
              deal={deal}
              mode="full"
              street={deal.street}
              privateRemarks={deal.privateRemarks}
            />
          ))}
        </div>
        {deals.length === 0 ? (
          <p className="mt-4 text-sm text-white/50">No active buyer deals in the feed.</p>
        ) : null}
      </div>
    </div>
  );
}
