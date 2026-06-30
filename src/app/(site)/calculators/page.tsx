import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  investmentCalculatorBySlug,
} from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Investment Calculators",
  description: "Real estate investment calculators on ListQik.",
};

function calculatorsRedirectTarget(tab: string | undefined): string {
  if (tab && investmentCalculatorBySlug(tab)) {
    const id = investmentCalculatorBySlug(tab)!.id;
    if (BUYER_INVESTMENT_CALCULATOR_IDS.includes(id)) {
      return `/buyers?tab=${encodeURIComponent(tab)}#buyer-calculators`;
    }
    return `/investors?tab=${encodeURIComponent(tab)}#calculators`;
  }
  return "/investors#calculators";
}

export default async function PublicCalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  redirect(calculatorsRedirectTarget(tab));
}
