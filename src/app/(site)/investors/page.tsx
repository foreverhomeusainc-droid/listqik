import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InvestorsPageContent } from "@/components/investors/investors-page-content";
import { getInvestorsCopy } from "@/i18n/investors-copy";
import { listDealsOfTheWeek } from "@/lib/listings/public-listings-service";
import { englishOnlyAlternates } from "@/lib/locale-metadata";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  INVESTOR_INVESTMENT_CALCULATOR_IDS,
  investmentCalculatorBySlug,
  type InvestmentCalculatorId,
} from "@/lib/calculators/types";

const copy = getInvestorsCopy();

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: englishOnlyAlternates("/investors"),
};

export const revalidate = 60;

function resolveTab(tab: string | undefined): InvestmentCalculatorId | null {
  if (!tab || !investmentCalculatorBySlug(tab)) return null;
  const id = investmentCalculatorBySlug(tab)!.id;
  if (INVESTOR_INVESTMENT_CALCULATOR_IDS.includes(id)) return id;
  return null;
}

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  if (tab && investmentCalculatorBySlug(tab)) {
    const id = investmentCalculatorBySlug(tab)!.id;
    if (BUYER_INVESTMENT_CALCULATOR_IDS.includes(id)) {
      redirect(`/buyers?tab=${encodeURIComponent(tab)}#buyer-calculators`);
    }
  }
  const [dealsOfTheWeek] = await Promise.all([listDealsOfTheWeek(4)]);

  return (
    <InvestorsPageContent
      dealsOfTheWeek={dealsOfTheWeek}
      initialTab={resolveTab(tab) ?? INVESTOR_INVESTMENT_CALCULATOR_IDS[0] ?? "reverse-invest"}
    />
  );
}
