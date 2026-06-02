"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CockpitHudFrame } from "@/components/marketing/cockpit-hud-frame";
import { MarketingPageScrim } from "@/components/marketing/marketing-page-scrim";
import { PricingLanguageToggle } from "@/components/pricing/pricing-language-toggle";
import { Container } from "@/components/container";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getFullServiceCopy, type FullServiceCopy, type FullServiceTierCopy } from "@/i18n/full-service-copy";
import { localeSitePath } from "@/lib/locale-site-path";

function tierMailtoSubject(tier: FullServiceTierCopy): string {
  return encodeURIComponent(`Full Service — ${tier.name} (${tier.commission} listing commission)`);
}

function FullServiceTierCard({
  tier,
  locale,
  checkout,
}: {
  tier: FullServiceTierCopy;
  locale: "en" | "es";
  checkout: FullServiceCopy["checkout"];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mailto = `mailto:concierge@listqik.com?subject=${tierMailtoSubject(tier)}`;

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/full-service/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || checkout.error);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError(checkout.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className={[
        "flex h-full flex-col rounded-2xl border bg-black/40 p-6 sm:p-8",
        tier.highlight
          ? "border-emerald-400/50 shadow-[0_0_32px_rgba(16,185,129,0.15)]"
          : "border-white/12",
      ].join(" ")}
    >
      {tier.badge ? (
        <div className="-mt-9 mb-4 flex justify-center">
          <span className="rounded-full border border-emerald-400/60 bg-emerald-500/25 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100">
            {tier.badge}
          </span>
        </div>
      ) : (
        <div className="h-2" />
      )}

      <div className="text-center">
        <p className="font-mono text-5xl font-bold tracking-tight text-white sm:text-6xl">
          {tier.commission}
        </p>
        <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/55">
          {tier.commissionLabel}
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-emerald-100">{tier.name}</h2>
      </div>

      <p className="mt-5 text-center text-sm leading-relaxed text-white/75">{tier.description}</p>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm text-white/85">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <span
              aria-hidden
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300"
            >
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        {tier.highlight ? (
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={loading}
            className="btn-primary flex w-full justify-center text-center disabled:opacity-60"
          >
            {loading ? checkout.loading : tier.cta}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={loading}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-emerald-400/60 bg-transparent px-6 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/10 disabled:opacity-60"
          >
            {loading ? checkout.loading : tier.cta}
          </button>
        )}
        {error ? <p className="text-center text-xs text-amber-200/90">{error}</p> : null}
        <p className="text-center">
          <a href={mailto} className="text-xs text-emerald-300/80 underline underline-offset-2 hover:text-emerald-200">
            {checkout.mailtoAlt}
          </a>
        </p>
        <p className="text-center text-xs leading-relaxed text-white/50">{tier.footnote}</p>
      </div>
    </article>
  );
}

export function FullServiceConsole() {
  const { locale, ready } = useSiteLocale();
  const copy = getFullServiceCopy(locale);
  const pricingHref = localeSitePath(copy.pricingLink.href, locale);
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-20">
        <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
      </div>
    );
  }

  return (
    <MarketingPageScrim>
      <div className="py-10 sm:py-14">
        <Container className="space-y-8 sm:space-y-10">
          {checkoutStatus === "success" ? (
            <div
              role="status"
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100"
            >
              {copy.checkout.successBanner}
            </div>
          ) : null}
          {checkoutStatus === "cancelled" ? (
            <div
              role="status"
              className="rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100"
            >
              {copy.checkout.cancelledBanner}
            </div>
          ) : null}

          <CockpitHudFrame padding="compact" className="border-emerald-500/25">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div className="font-mono text-xs tracking-[0.22em] text-emerald-300/80">
                {copy.hud.label}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PricingLanguageToggle />
                <div className="rounded border border-amber-300/70 bg-amber-500/20 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-amber-100">
                  {copy.hud.live}
                </div>
              </div>
            </div>

            <div className="mt-5 max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {copy.header.title}
              </h1>
              <p className="text-sm leading-relaxed text-muted sm:text-base">{copy.header.subtitle}</p>
              <p className="text-sm text-white/60">{copy.header.compareNote}</p>
              <Link
                href={pricingHref}
                className="inline-flex text-sm font-semibold text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
              >
                {copy.pricingLink.label} →
              </Link>
            </div>
          </CockpitHudFrame>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {copy.tiers.map((tier) => (
              <FullServiceTierCard key={tier.id} tier={tier} locale={locale} checkout={copy.checkout} />
            ))}
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-white/55 sm:p-6 sm:text-sm">
            {copy.disclaimer}
          </section>

          <p className="text-center text-sm text-white/50">
            <Link href={pricingHref} className="text-emerald-300 underline">
              {copy.pricingLink.label}
            </Link>
          </p>
        </Container>
      </div>
    </MarketingPageScrim>
  );
}
