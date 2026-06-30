import type { Metadata } from "next";
import { BuyersPageContent } from "@/components/buyers/buyers-page-content";
import { localeAlternates } from "@/lib/locale-metadata";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  investmentCalculatorBySlug,
  type InvestmentCalculatorId,
} from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Buyer Deals | ListQik",
  description:
    "MLS buyer deals, payment calculators, and comps for Texas home shoppers. Unlock full inventory after Buyer Representation.",
  alternates: localeAlternates("/buyers"),
};

function resolveTab(tab: string | undefined): InvestmentCalculatorId {
  if (tab && investmentCalculatorBySlug(tab)) {
    const id = investmentCalculatorBySlug(tab)!.id;
    if (BUYER_INVESTMENT_CALCULATOR_IDS.includes(id)) return id;
  }
  return BUYER_INVESTMENT_CALCULATOR_IDS[0] ?? "mortgage";
}

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <BuyersPageContent initialCalculatorTab={resolveTab(tab)} />;
}
