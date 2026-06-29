import { redirect } from "next/navigation";
import { legacyCalculatorBySlug } from "@/lib/calculators/types";

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

  redirect(`/es/calculators?tab=${slug}`);
}
