"use client";

import Link from "next/link";
import { Suspense } from "react";
import { InvestmentCalculatorsApp } from "@/components/calculators/investment/investment-calculators-app";
import { InvestorLegacyCalculatorGrid } from "@/components/investors/investor-legacy-calculator-grid";
import { FeaturedBuyerDeals } from "@/components/buyers/featured-buyer-deals";
import { CompsTool } from "@/components/buyers/comps-tool";
import { Container } from "@/components/container";
import { DealsOfTheWeekSection } from "@/components/listings/deals-of-the-week-section";
import type { Listing } from "@/data/types";
import { getInvestorsCopy } from "@/i18n/investors-copy";
import {
  INVESTOR_INVESTMENT_CALCULATOR_IDS,
  type InvestmentCalculatorId,
} from "@/lib/calculators/types";

type InvestorsPageContentProps = {
  dealsOfTheWeek: Listing[];
  initialTab: InvestmentCalculatorId;
};

export function InvestorsPageContent({ dealsOfTheWeek, initialTab }: InvestorsPageContentProps) {
  const copy = getInvestorsCopy();

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl space-y-14">
          <header className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-black/50 p-6 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(52,211,153,0.22),transparent_55%)]"
            />
            <div className="relative space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                {copy.hero.eyebrow}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {copy.hero.title}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
                {copy.hero.subtitle}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/buyers"
                  className="inline-flex justify-center rounded-full border border-sky-400/60 bg-sky-500/20 px-6 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-500/30"
                >
                  {copy.hero.ctaDeals}
                </Link>
                <Link
                  href="/login?callbackUrl=%2Fdashboard%2Fvelocity-club"
                  className="inline-flex justify-center rounded-full border border-emerald-400/50 px-6 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
                >
                  {copy.hero.ctaVelocity}
                </Link>
              </div>
            </div>
          </header>

          <section className="space-y-6" id="calculators">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
                {copy.calculators.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {copy.calculators.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-white/65">{copy.calculators.intro}</p>
            </div>
            <Suspense fallback={<p className="text-sm text-white/60">Loading calculators...</p>}>
              <InvestmentCalculatorsApp
                initialTab={initialTab}
                catalogIds={INVESTOR_INVESTMENT_CALCULATOR_IDS}
                memberBasePath="/dashboard/calculators"
                showHeader={false}
                showLegacyLink={false}
              />
            </Suspense>
            <InvestorLegacyCalculatorGrid
              eyebrow={copy.calculators.legacyEyebrow}
              title={copy.calculators.legacyTitle}
              intro={copy.calculators.legacyIntro}
            />
          </section>

          <section className="space-y-6" aria-labelledby="why-investors">
            <div>
              <h2 id="why-investors" className="text-2xl font-semibold text-emerald-50 sm:text-3xl">
                {copy.why.title}
              </h2>
              <p className="mt-3 max-w-3xl text-base text-white/70">{copy.why.intro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.why.pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-emerald-100">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{pillar.body}</p>
                </article>
              ))}
            </div>
          </section>

          <FeaturedBuyerDeals
            eyebrow="Investor deals"
            title="MLS investor inventory"
            subtitle="Ranked opportunities for flippers, wholesalers, and buy-and-hold operators — with ARV where available."
            limit={4}
            buyersPageHref="/dashboard/buyers"
            showArv
          />

          <section className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-emerald-50">MLS comps generator</h2>
            <p className="mt-2 text-sm text-white/65">
              Syndicate+ members get instant comps. Everyone else can submit property details for a
              free manual comps email from our team.
            </p>
            <div className="mt-5">
              <CompsTool source="investors-page" />
            </div>
          </section>

          <DealsOfTheWeekSection
            deals={dealsOfTheWeek}
            eyebrow={copy.deals.eyebrow}
            title={copy.deals.title}
            intro={copy.deals.intro}
            viewAllHref="/listings"
            viewAllLabel={copy.deals.viewAll}
            emptyMessage={copy.deals.empty}
          />
        </div>
      </Container>
    </main>
  );
}
