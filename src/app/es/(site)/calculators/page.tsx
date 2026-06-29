import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { InvestmentCalculatorsApp } from "@/components/calculators/investment/investment-calculators-app";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";
import type { InvestmentCalculatorId } from "@/lib/calculators/types";
import { investmentCalculatorBySlug } from "@/lib/calculators/types";

export const metadata: Metadata = buildLocalizedMetadata("es", "/calculators", {
  title: "Calculadoras para inversionistas",
  description: "Calculadoras de inversión: hipoteca, notas, valor presente y más.",
});

function resolveTab(tab: string | undefined): InvestmentCalculatorId {
  if (tab && investmentCalculatorBySlug(tab)) {
    return investmentCalculatorBySlug(tab)!.id;
  }
  return "mortgage";
}

export default async function EsCalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = resolveTab(tab);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <Suspense fallback={<p className="text-sm text-white/60">Loading calculator...</p>}>
          <InvestmentCalculatorsApp initialTab={initialTab} memberBasePath="/dashboard/calculators" />
        </Suspense>
      </Container>
    </main>
  );
}
