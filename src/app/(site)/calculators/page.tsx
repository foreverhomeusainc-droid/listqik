import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { InvestmentCalculatorsApp } from "@/components/calculators/investment/investment-calculators-app";
import type { InvestmentCalculatorId } from "@/lib/calculators/types";
import { investmentCalculatorBySlug } from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Investment Calculators",
  description:
    "Mortgage, reverse invest, note buyer, present value, rent home, and multi-family calculators for real estate investors.",
};

function resolveTab(tab: string | undefined): InvestmentCalculatorId {
  if (tab && investmentCalculatorBySlug(tab)) {
    return investmentCalculatorBySlug(tab)!.id;
  }
  return "mortgage";
}

export default async function PublicCalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = resolveTab(tab);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <Suspense fallback={<p className="text-sm text-white/60">Loading calculators...</p>}>
          <InvestmentCalculatorsApp initialTab={initialTab} memberBasePath="/dashboard/calculators" />
        </Suspense>
      </Container>
    </main>
  );
}
