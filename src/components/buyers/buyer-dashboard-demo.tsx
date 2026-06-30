"use client";

import Link from "next/link";
import { BuyerRepAcknowledge } from "@/components/buyers/buyer-rep-acknowledge";
import { BuyersConsole } from "@/components/buyers/buyers-console";
import { Container } from "@/components/container";
import { BuyerRepresentationContent } from "@/components/legal/buyer-representation-content";

type BuyerDashboardDemoProps = {
  hasBuyerRep: boolean;
  demoPath: string;
};

export function BuyerDashboardDemo({ hasBuyerRep, demoPath }: BuyerDashboardDemoProps) {
  if (!hasBuyerRep) {
    return (
      <div className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <header className="space-y-3">
              <p className="inline-flex rounded-full border border-amber-400/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-100">
                Investor demo
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Buyer Representation Agreement
              </h1>
              <p className="text-base text-muted">
                Step 1 of 2 — acknowledge buyer representation to unlock the MLS deal feed and comps
                engine in this demo.
              </p>
            </header>

            <section className="glass-surface-strong space-y-6 p-6 sm:p-8">
              <BuyerRepresentationContent />
            </section>

            <section className="glass-surface space-y-4 p-5 sm:p-6">
              <BuyerRepAcknowledge nextUrl={demoPath} />
            </section>

            <p className="text-center text-xs text-white/45">
              After you agree, you&apos;ll land on the buyer dashboard with live comps and deal cards.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-3">
            <p className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Investor demo · Step 2
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Buyer dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Full MLS buyer feed, private remarks, and comps. Try ZIP codes like{" "}
                  <span className="font-mono text-emerald-200">75206</span>,{" "}
                  <span className="font-mono text-emerald-200">78745</span>, or{" "}
                  <span className="font-mono text-emerald-200">77008</span>.
                </p>
              </div>
              <Link
                href="/dashboard/buyers"
                className="inline-flex shrink-0 justify-center rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/35"
              >
                Open in member dashboard
              </Link>
            </div>
          </header>

          <BuyersConsole />
        </div>
      </Container>
    </div>
  );
}
