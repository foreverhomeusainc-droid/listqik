"use client";

import Link from "next/link";
import { CockpitGauge } from "@/components/cockpit-gauge";
import { Container } from "@/components/container";
import { ComparisonTable } from "@/components/comparison-table";
import { HomeLanguageToggle } from "@/components/home/home-language-toggle";
import { CockpitBackdropPanel } from "@/components/marketing/cockpit-backdrop-panel";
import { CockpitHudFrame } from "@/components/marketing/cockpit-hud-frame";
import { MarketingPageScrim } from "@/components/marketing/marketing-page-scrim";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getHomepageCopy } from "@/i18n/homepage-copy";
import type { Listing } from "@/data/types";
import { ListingCard } from "@/components/listing-card";
import { BuyerDealsTeaser } from "@/components/buyers/buyer-deals-teaser";
import { NetProceedsCalculator } from "@/components/net-proceeds-calculator";
import { listings as staticListings } from "@/data/listings";

const MISSION_HREFS = ["/pricing", "/pricing", "/listings"] as const;

export function HomePageContent({ featuredListings }: { featuredListings?: Listing[] }) {
  const { locale, ready } = useSiteLocale();
  const copy = getHomepageCopy(locale);
  const featured =
    featuredListings && featuredListings.length > 0
      ? featuredListings.slice(0, 3)
      : staticListings.filter((l) => l.featured).slice(0, 3);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-400/40 border-t-emerald-300" />
      </div>
    );
  }

  return (
    <MarketingPageScrim>
      <section className="cockpit-hero bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),rgba(2,6,3,0.92)_55%)] pt-6 sm:pt-10 lg:pt-14">
        <div aria-hidden className="cockpit-scanlines absolute inset-0 z-[1]" />
        <Container className="relative z-[2]">
          <CockpitHudFrame>
            <div className="mb-4 flex flex-col items-center justify-center gap-3 border-b border-emerald-500/25 pb-3 sm:mb-6 sm:flex-row sm:justify-between sm:gap-3 sm:pb-4">
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[9px] tracking-[0.18em] text-emerald-300/80 sm:text-[11px] sm:tracking-[0.25em]">
                <span className="text-emerald-300/90">{copy.hud.left}</span>
                <span className="text-lime-300/90">{copy.hud.center}</span>
                <span className="text-emerald-400/80">{copy.hud.right}</span>
              </div>
              <HomeLanguageToggle />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-black/60 p-4 sm:p-6 lg:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(52,211,153,0.28),rgba(0,0,0,0.92)_65%)]"
              />
              <div className="relative mx-auto max-w-3xl text-center">
                <div className="inline-flex max-w-full items-center gap-2 rounded border border-emerald-500/40 bg-emerald-950/35 px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] text-emerald-200 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  {copy.hero.badge}
                </div>
                <h1 className="mt-4 bg-gradient-to-r from-lime-200 via-emerald-100 to-emerald-300 bg-clip-text font-mono text-2xl font-bold uppercase tracking-tight text-transparent max-sm:normal-case sm:text-4xl lg:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
                  {copy.hero.subtitle}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-6 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
                  >
                    {copy.hero.startListing}
                  </Link>
                  <Link
                    href="/listings"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-emerald-400/40 bg-black/35 px-6 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-950/40"
                  >
                    {copy.hero.browseListings}
                  </Link>
                </div>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {copy.missionPanels.map((panel, index) => (
                  <Link
                    key={panel.title}
                    href={MISSION_HREFS[index] ?? "/pricing"}
                    className="group rounded-2xl border border-emerald-400/35 bg-black/65 p-4 transition duration-200 hover:scale-[1.02] hover:border-emerald-300/70 hover:bg-emerald-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
                  >
                    <h3 className="text-sm font-semibold tracking-wide text-emerald-200 sm:text-base">
                      {panel.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/75">{panel.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <CockpitBackdropPanel className="mt-6">
              <div className="w-full min-w-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-black/45">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"
                />

                <div className="relative flex w-full flex-col items-center gap-5 p-3 pt-5 sm:p-4 md:grid md:grid-cols-3 md:items-end md:justify-items-center md:gap-6 lg:p-6">
                  <div className="origin-top scale-95">
                    <CockpitGauge
                      label={copy.gauges.speed}
                      sublabel={copy.gauges.sublabel}
                      value={88}
                      size="sm"
                      accent="emerald"
                    />
                  </div>
                  <div className="origin-top scale-[0.78] min-[400px]:scale-[0.88] sm:scale-95 lg:scale-100">
                    <CockpitGauge
                      label={copy.gauges.support}
                      sublabel={copy.gauges.sublabel}
                      value={72}
                      size="lg"
                      accent="emerald"
                    />
                  </div>
                  <div className="origin-top scale-95">
                    <CockpitGauge
                      label={copy.gauges.savings}
                      sublabel={copy.gauges.sublabel}
                      value={64}
                      size="sm"
                      accent="emerald"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:grid lg:grid-cols-5">
                <div className="cockpit-mfd-wrap relative min-w-0 border border-lime-400/30 bg-emerald-950/35 p-0.5 shadow-[0_0_28px_rgba(16,185,129,0.18)] sm:p-1 lg:col-span-3 lg:col-start-2">
                  <NetProceedsCalculator locale={locale} />
                </div>
              </div>
            </CockpitBackdropPanel>
          </CockpitHudFrame>
        </Container>
      </section>

      <section className="pt-8 sm:pt-10 lg:pt-14">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.modules.map((module) => (
              <article
                key={module.title}
                className="glass-surface rounded-2xl border border-emerald-500/20 bg-black/45 p-5"
              >
                <h3 className="text-base font-semibold text-emerald-200">{module.title}</h3>
                <p className="mt-2 text-sm text-white/75">{module.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-8 sm:pt-10 lg:pt-14">
        <Container>
          <BuyerDealsTeaser limit={4} />
        </Container>
      </section>

      <section className="pt-8 sm:pt-10 lg:pt-14">
        <Container>
          <div className="glass-surface rounded-2xl border border-emerald-500/20 bg-black/45 p-6 text-center sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-emerald-100 sm:text-3xl">
              {copy.stats.title}
            </h2>
            <div className="mt-6 grid gap-4 text-emerald-200 sm:grid-cols-3 sm:gap-6">
              <div className="rounded-xl border border-emerald-400/30 bg-black/35 px-4 py-5">
                <p className="text-3xl font-bold">72</p>
                <p className="mt-1 text-xs tracking-wider text-white/65">{copy.stats.listingsStarted}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-black/35 px-4 py-5">
                <p className="text-3xl font-bold">64%</p>
                <p className="mt-1 text-xs tracking-wider text-white/65">{copy.stats.savingsIndicator}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-black/35 px-4 py-5">
                <p className="text-3xl font-bold">100+</p>
                <p className="mt-1 text-xs tracking-wider text-white/65">{copy.stats.activeListings}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-8 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
              >
                {copy.stats.cta}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-8 sm:pt-10 lg:pt-14">
        <Container>
          <ComparisonTable locale={locale} />
        </Container>
      </section>

      <section className="pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-widest text-white/60">{copy.featured.kicker}</div>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-2xl">
                {copy.featured.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{copy.featured.subtitle}</p>
            </div>
            <Link href="/listings" className="btn-secondary hidden shrink-0 sm:inline-flex">
              {copy.featured.openListings}
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/listings" className="btn-secondary w-full">
              {copy.featured.openListings}
            </Link>
          </div>
        </Container>
      </section>
    </MarketingPageScrim>
  );
}
