"use client";

import Link from "next/link";
import { Suspense } from "react";
import { BuyerDealsTeaser } from "@/components/buyers/buyer-deals-teaser";
import { InvestmentCalculatorsApp } from "@/components/calculators/investment/investment-calculators-app";
import { Container } from "@/components/container";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  type InvestmentCalculatorId,
} from "@/lib/calculators/types";

export function BuyersPageContent({
  initialCalculatorTab = "mortgage",
}: {
  initialCalculatorTab?: InvestmentCalculatorId;
}) {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl space-y-12">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
              Buyer deals
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Buyer deals from MLS — built for home shoppers &amp; operators
            </h1>
            <p className="max-w-3xl text-base text-white/75">
              Browse teaser inventory and model your payment and present-value scenarios. Register,
              sign Buyer Representation, and open your buyer dashboard to run MLS comps.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/login?callbackUrl=/buyer-representation"
                className="inline-flex justify-center rounded-full border border-sky-400/60 bg-sky-500/20 px-6 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-500/30"
              >
                Sign in &amp; sign Buyer Rep
              </Link>
              <Link
                href="/buyers/register"
                className="inline-flex justify-center rounded-full border border-amber-400/50 px-6 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-950/35"
              >
                Request buyer account
              </Link>
              <Link
                href="/dashboard/buyers"
                className="inline-flex justify-center rounded-full border border-emerald-400/50 px-6 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
              >
                Open buyer dashboard
              </Link>
            </div>
          </header>

          <BuyerDealsTeaser
            showCta={false}
            limit={6}
            eyebrow="Deals of the Week"
            title="Featured buyer deals"
            subtitle="Hand-selected MLS opportunities for home shoppers — register and sign Buyer Representation to unlock full details in your dashboard."
          />

          <section className="space-y-5" id="buyer-calculators">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/70">
                Buyer tools
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Payment &amp; planning calculators
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-white/65">
                Mortgage payment modeling and present-value math for everyday buyers — no investor
                jargon required.
              </p>
            </div>
            <Suspense fallback={<p className="text-sm text-white/60">Loading calculators...</p>}>
              <InvestmentCalculatorsApp
                initialTab={initialCalculatorTab}
                catalogIds={BUYER_INVESTMENT_CALCULATOR_IDS}
                memberBasePath="/dashboard/calculators"
                showHeader={false}
                showLegacyLink={false}
              />
            </Suspense>
          </section>

          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-emerald-50">MLS comps generator</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              The comps engine lives inside your buyer dashboard — not on this public page. Request an
              account or sign in, complete Buyer Representation, then open the dashboard to generate
              comps or request manual comps from our team.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/buyers/register"
                className="inline-flex justify-center rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-950/35"
              >
                Request buyer account
              </Link>
              <Link
                href="/login?callbackUrl=/dashboard/buyers"
                className="inline-flex justify-center rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
              >
                Sign in to buyer dashboard
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
