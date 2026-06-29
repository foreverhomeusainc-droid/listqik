"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { BrrrrCalculator } from "@/components/calculators/legacy/brrrr-calculator";
import { CalculatorGatingBanner } from "@/components/calculators/calculator-shell";
import { FixAndFlipCalculator } from "@/components/calculators/legacy/fix-and-flip-calculator";
import { MortgageCalculator } from "@/components/calculators/legacy/mortgage-calculator";
import { MultifamilyCalculator } from "@/components/calculators/legacy/multifamily-calculator";
import { RentalCalculator } from "@/components/calculators/legacy/rental-calculator";
import { useCalculatorAccess } from "@/components/calculators/use-calculator-access";
import { WholesaleCalculator } from "@/components/calculators/legacy/wholesale-calculator";
import { legacyCalculatorBySlug } from "@/lib/calculators/types";

export function LegacyCalculatorToolPage({
  slug,
  memberBasePath,
}: {
  slug: string;
  memberBasePath: string;
}) {
  const calc = legacyCalculatorBySlug(slug);
  const { access, loading } = useCalculatorAccess(calc?.id ?? slug);

  if (!calc) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3">
        <p className="text-sm text-amber-100/90">
          <span className="font-semibold uppercase tracking-wide text-amber-300">Legacy (OLD)</span>
          {" · "}
          {calc.name}
        </p>
        <Link
          href="/calculators"
          className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
        >
          ← Main calculators
        </Link>
      </div>
      {!loading ? <CalculatorGatingBanner access={access} memberBasePath={memberBasePath} /> : null}
      {slug === "fix-and-flip" ? (
        <FixAndFlipCalculator access={access} memberMode={memberBasePath.includes("/dashboard")} />
      ) : null}
      {slug === "rental" ? <RentalCalculator access={access} /> : null}
      {slug === "multifamily" ? <MultifamilyCalculator access={access} /> : null}
      {slug === "mortgage" ? <MortgageCalculator access={access} /> : null}
      {slug === "brrrr" ? <BrrrrCalculator access={access} /> : null}
      {slug === "wholesale" ? <WholesaleCalculator access={access} /> : null}
    </div>
  );
}
