import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BuyersPageContent } from "@/components/buyers/buyers-page-content";
import { englishOnlyAlternates } from "@/lib/locale-metadata";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  investmentCalculatorBySlug,
  type InvestmentCalculatorId,
} from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Buyer Deals | ListQik",
  description:
    "MLS buyer deals, payment calculators, and comps for Texas home shoppers. Unlock full inventory after Buyer Representation.",
  alternates: englishOnlyAlternates("/buyers"),
};

function resolveTab(tab: string | undefined): InvestmentCalculatorId | null {
  if (!tab || !investmentCalculatorBySlug(tab)) return null;
  const id = investmentCalculatorBySlug(tab)!.id;
  if (BUYER_INVESTMENT_CALCULATOR_IDS.includes(id)) return id;
  return null;
}

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const resolved = resolveTab(tab);
  if (tab && investmentCalculatorBySlug(tab) && !resolved) {
    redirect(`/investors?tab=${encodeURIComponent(tab)}#calculators`);
  }
  return <BuyersPageContent initialCalculatorTab={resolved ?? "mortgage"} />;
}
