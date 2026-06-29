import { Suspense } from "react";
import { InvestmentCalculatorsApp } from "@/components/calculators/investment/investment-calculators-app";
import type { InvestmentCalculatorId } from "@/lib/calculators/types";
import { investmentCalculatorBySlug } from "@/lib/calculators/types";

function resolveTab(tab: string | undefined): InvestmentCalculatorId {
  if (tab && investmentCalculatorBySlug(tab)) {
    return investmentCalculatorBySlug(tab)!.id;
  }
  return "mortgage";
}

export default async function DashboardCalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = resolveTab(tab);

  return (
    <Suspense fallback={<p className="text-sm text-white/60">Loading calculators...</p>}>
      <InvestmentCalculatorsApp
        initialTab={initialTab}
        memberBasePath="/dashboard/calculators"
        showLegacyLink
      />
    </Suspense>
  );
}
