import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  legacyCalculatorBySlug,
  investmentCalculatorBySlug,
} from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Investor Calculators",
  description: "Real estate investor calculators.",
};

export function generateStaticParams() {
  return [];
}

/** Legacy slug URLs redirect to the new tabbed app or legacy archive. */
export default async function PublicCalculatorsSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (legacyCalculatorBySlug(slug)) {
    redirect(`/calculators/legacy/${slug}`);
  }

  const meta = investmentCalculatorBySlug(slug);
  if (meta) {
    if (BUYER_INVESTMENT_CALCULATOR_IDS.includes(meta.id)) {
      redirect(`/buyers?tab=${slug}#buyer-calculators`);
    }
    redirect(`/investors?tab=${slug}#calculators`);
  }

  redirect("/investors#calculators");
}
