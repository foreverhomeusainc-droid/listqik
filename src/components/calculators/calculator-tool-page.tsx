"use client";

import { notFound } from "next/navigation";
import { BrrrrCalculator } from "@/components/calculators/brrrr-calculator";
import { CalculatorGatingBanner } from "@/components/calculators/calculator-shell";
import { FixAndFlipCalculator } from "@/components/calculators/fix-and-flip-calculator";
import { MortgageCalculator } from "@/components/calculators/mortgage-calculator";
import { MultifamilyCalculator } from "@/components/calculators/multifamily-calculator";
import { RentalCalculator } from "@/components/calculators/rental-calculator";
import { useCalculatorAccess } from "@/components/calculators/use-calculator-access";
import { WholesaleCalculator } from "@/components/calculators/wholesale-calculator";
import { calculatorBySlug } from "@/lib/calculators/types";

export function CalculatorToolPage({
  slug,
  memberBasePath,
}: {
  slug: string;
  memberBasePath: string;
}) {
  const calc = calculatorBySlug(slug);
  const { access, loading } = useCalculatorAccess(slug);

  if (!calc) notFound();

  return (
    <div className="space-y-4">
      {!loading ? <CalculatorGatingBanner access={access} memberBasePath={memberBasePath} /> : null}
      {slug === "fix-and-flip" ? <FixAndFlipCalculator access={access} memberMode={memberBasePath.includes("/dashboard")} /> : null}
      {slug === "rental" ? <RentalCalculator access={access} /> : null}
      {slug === "multifamily" ? <MultifamilyCalculator access={access} /> : null}
      {slug === "mortgage" ? <MortgageCalculator access={access} /> : null}
      {slug === "brrrr" ? <BrrrrCalculator access={access} /> : null}
      {slug === "wholesale" ? <WholesaleCalculator access={access} /> : null}
    </div>
  );
}
