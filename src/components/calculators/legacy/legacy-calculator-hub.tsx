"use client";

import Link from "next/link";
import { LEGACY_CALCULATOR_CATALOG } from "@/lib/calculators/types";

export function LegacyCalculatorHub({ basePath }: { basePath: string }) {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-amber-500/25 bg-black/45 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/70">
              Archived · Phase 2
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-amber-50 sm:text-4xl">
              Legacy Calculator Center
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
              Previous deal analyzers (fix &amp; flip, BRRRR, wholesale, cash-flow rental, etc.).
              Kept for reference — the main{" "}
              <Link href="/calculators" className="text-emerald-300 underline-offset-2 hover:underline">
                Investment Calculators
              </Link>{" "}
              are now the primary tools.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
            OLD
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LEGACY_CALCULATOR_CATALOG.map((calc) => (
          <Link
            key={calc.id}
            href={`${basePath}/${calc.slug}`}
            className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-amber-400/35 hover:bg-amber-950/15"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/60">
              {calc.investorFocus} · Legacy
            </p>
            <h2 className="mt-2 text-lg font-semibold text-amber-50 group-hover:text-amber-100">
              {calc.name}
            </h2>
            <p className="mt-2 text-sm text-white/65">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
