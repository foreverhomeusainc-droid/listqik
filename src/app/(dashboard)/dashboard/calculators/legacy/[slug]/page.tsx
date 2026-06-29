import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LegacyCalculatorToolPage } from "@/components/calculators/legacy/legacy-calculator-tool-page";
import { LEGACY_CALCULATOR_CATALOG, legacyCalculatorBySlug } from "@/lib/calculators/types";

export function generateStaticParams() {
  return LEGACY_CALCULATOR_CATALOG.map((c) => ({ slug: c.slug }));
}

export default async function DashboardLegacyCalculatorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!legacyCalculatorBySlug(slug)) notFound();

  return (
    <Suspense fallback={<p className="text-sm text-white/60">Loading calculator...</p>}>
      <LegacyCalculatorToolPage slug={slug} memberBasePath="/dashboard/calculators/legacy" />
    </Suspense>
  );
}
