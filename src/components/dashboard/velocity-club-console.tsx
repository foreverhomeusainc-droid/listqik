"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { VelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import type { CreditBundleDefinition } from "@/lib/loyalty/credit-bundles";
import type { OnboardingState } from "@/lib/loyalty/onboarding";
import { VelocityClubOnboarding } from "@/components/dashboard/velocity-club-onboarding";
import { VelocityClubSnapshotCard } from "@/components/dashboard/velocity-club-snapshot";

type CreditRow = {
  id: string;
  bundleSlug: string;
  bundleName: string;
  quantityPurchased: number;
  quantityRemaining: number;
  purchasedAt: string | null;
};

type Payload = {
  ok?: boolean;
  snapshot?: VelocityClubSnapshot;
  bundles?: CreditBundleDefinition[];
  credits?: CreditRow[];
  onboarding?: OnboardingState;
  error?: string;
};

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function VelocityClubConsole() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<VelocityClubSnapshot | null>(null);
  const [bundles, setBundles] = useState<CreditBundleDefinition[]>([]);
  const [credits, setCredits] = useState<CreditRow[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);
  const [redeemBusy, setRedeemBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(
    checkoutSuccess ? "Payment received — credits will appear once Stripe confirms." : null,
  );

  const [pollAttempts, setPollAttempts] = useState(0);
  const creditsBaselineRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/velocity-club", { cache: "no-store" });
      const data = (await res.json()) as Payload;
      if (!res.ok || !data.ok || !data.snapshot) {
        setError(data.error ?? "Could not load Velocity Club.");
        return;
      }
      setSnapshot(data.snapshot);
      setBundles(data.bundles ?? []);
      setCredits(data.credits ?? []);
      setOnboarding(data.onboarding ?? null);
      if (creditsBaselineRef.current === null) {
        creditsBaselineRef.current = data.snapshot.unusedCredits;
      }
      if (checkoutSuccess && data.snapshot.unusedCredits > (creditsBaselineRef.current ?? 0)) {
        setBanner("Pipeline bundle secured. Credits added to your bank.");
      }
    } catch {
      setError("Could not load Velocity Club right now.");
    } finally {
      setLoading(false);
    }
  }, [checkoutSuccess]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!checkoutSuccess || pollAttempts >= 10) return;
    if (
      creditsBaselineRef.current !== null &&
      snapshot &&
      snapshot.unusedCredits > creditsBaselineRef.current
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPollAttempts((c) => c + 1);
      void load();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [checkoutSuccess, pollAttempts, load, snapshot]);

  async function startCheckout(slug: string) {
    setCheckoutSlug(slug);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/velocity-club/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleSlug: slug }),
      });
      const data = (await res.json()) as { ok?: boolean; checkoutUrl?: string; error?: string };
      if (!res.ok || !data.ok || !data.checkoutUrl) {
        setError(data.error ?? "Checkout could not start.");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Checkout network error.");
    } finally {
      setCheckoutSlug(null);
    }
  }

  async function redeemCredit() {
    setRedeemBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/velocity-club/credits/redeem", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; nextUrl?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not redeem credit.");
        return;
      }
      window.location.href = data.nextUrl ?? "/pricing";
    } catch {
      setError("Redeem network error.");
    } finally {
      setRedeemBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-white/70">Loading Velocity Club...</p>;
  }

  if (error && !snapshot) {
    return <p className="text-sm text-rose-200">{error}</p>;
  }

  if (!snapshot) {
    return null;
  }

  return (
    <div className="space-y-6">
      {banner ? (
        <p className="rounded-xl border border-lime-400/30 bg-lime-950/20 px-4 py-3 text-sm text-lime-100">
          {banner}
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      {onboarding ? (
        <VelocityClubOnboarding
          onboarding={onboarding}
          listingsUntilNext={snapshot.listingsUntilNext}
          nextTierName={snapshot.nextTierName}
          onUpdated={() => void load()}
        />
      ) : null}

      <VelocityClubSnapshotCard snapshot={snapshot} showClubLink={false} />

      <section className="rounded-2xl border border-emerald-500/25 bg-black/45 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-emerald-50">Credit bank</h3>
        <p className="mt-1 text-sm text-white/70">
          Pre-funded listing credits count toward your tier immediately and never expire.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/25 px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Available credits</p>
            <p className="mt-1 text-3xl font-bold text-emerald-100">{snapshot.unusedCredits}</p>
          </div>
          {snapshot.unusedCredits > 0 ? (
            <button
              type="button"
              disabled={redeemBusy}
              onClick={() => void redeemCredit()}
              className="rounded-full border border-emerald-400/60 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30 disabled:opacity-60"
            >
              {redeemBusy ? "Redeeming..." : "Use 1 credit for next listing"}
            </button>
          ) : (
            <p className="text-sm text-white/60">Buy a pipeline bundle to lock in tier status.</p>
          )}
        </div>

        {credits.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/55">
                  <th className="py-2 pr-4">Bundle</th>
                  <th className="py-2 pr-4">Remaining</th>
                  <th className="py-2">Purchased</th>
                </tr>
              </thead>
              <tbody>
                {credits.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 text-emerald-50/90">
                    <td className="py-2 pr-4">{row.bundleName}</td>
                    <td className="py-2 pr-4">
                      {row.quantityRemaining} / {row.quantityPurchased}
                    </td>
                    <td className="py-2">
                      {row.purchasedAt ? new Date(row.purchasedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-emerald-500/25 bg-black/45 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-emerald-50">Pipeline bundles</h3>
        <p className="mt-1 text-sm text-white/70">
          Volume packs preview your tier bump at checkout. Pay once, deploy inventory on your timeline.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const previewCount = snapshot.effectiveCount + bundle.credits;
            return (
              <article
                key={bundle.slug}
                className="flex flex-col rounded-xl border border-white/10 bg-black/35 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/70">
                  {bundle.credits} listings
                </p>
                <h4 className="mt-2 text-lg font-semibold text-emerald-50">{bundle.name}</h4>
                <p className="mt-2 text-2xl font-bold text-white">{formatMoney(bundle.amountUsd)}</p>
                <p className="mt-2 text-xs text-lime-300/90">{bundle.savingsLabel}</p>
                <p className="mt-2 flex-1 text-sm text-white/65">{bundle.tierBumpHint}</p>
                <p className="mt-3 text-xs text-white/45">
                  Effective count after purchase: {previewCount}
                </p>
                <button
                  type="button"
                  disabled={checkoutSlug === bundle.slug}
                  onClick={() => void startCheckout(bundle.slug)}
                  className="mt-4 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30 disabled:opacity-60"
                >
                  {checkoutSlug === bundle.slug ? "Starting checkout..." : "Secure bundle"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
