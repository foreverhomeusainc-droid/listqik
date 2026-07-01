import { redirect } from "next/navigation";
import {
  BUYER_INVESTMENT_CALCULATOR_IDS,
  legacyCalculatorBySlug,
  investmentCalculatorBySlug,
} from "@/lib/calculators/types";

export function generateStaticParams() {
  return [];
}

export default async function EsCalculatorsSlugRedirectPage({
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
