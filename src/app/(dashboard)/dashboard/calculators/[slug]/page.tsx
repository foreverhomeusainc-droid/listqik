import { redirect } from "next/navigation";
import { legacyCalculatorBySlug } from "@/lib/calculators/types";

export function generateStaticParams() {
  return [];
}

export default async function DashboardCalculatorsSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (legacyCalculatorBySlug(slug)) {
    redirect(`/dashboard/calculators/legacy/${slug}`);
  }

  redirect(`/dashboard/calculators?tab=${slug}`);
}
