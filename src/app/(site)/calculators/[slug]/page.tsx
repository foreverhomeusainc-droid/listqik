import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { legacyCalculatorBySlug } from "@/lib/calculators/types";

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

  redirect(`/calculators?tab=${slug}`);
}
