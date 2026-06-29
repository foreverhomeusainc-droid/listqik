"use client";

import Link from "next/link";
import { INVESTMENT_CALCULATOR_CATALOG } from "@/lib/calculators/types";

/** @deprecated Use InvestmentCalculatorsApp on /calculators instead. */
export function CalculatorHub({ basePath }: { basePath: string }) {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-emerald-500/25 bg-black/45 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
          Investor tools
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-emerald-50 sm:text-4xl">Calculator Center</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
          Open the tabbed investment suite or browse individual calculator entry points.
        </p>
        <Link
          href={basePath === "/dashboard/calculators" ? "/dashboard/calculators" : "/calculators"}
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Open Investment Calculators
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {INVESTMENT_CALCULATOR_CATALOG.map((calc) => (
          <Link
            key={calc.id}
            href={`${basePath}?tab=${calc.slug}`}
            className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-emerald-400/40 hover:bg-emerald-950/20"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/70">
              {calc.investorFocus}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-emerald-50 group-hover:text-lime-100">
              {calc.name}
            </h2>
            <p className="mt-2 text-sm text-white/65">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
