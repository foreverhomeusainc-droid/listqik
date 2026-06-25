import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalculatorToolPage } from "@/components/calculators/calculator-tool-page";
import { CALCULATOR_CATALOG, calculatorBySlug } from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Deal Analyzer",
  description: "Members-only investor calculators with unlimited runs and Velocity Club integration.",
};

export function generateStaticParams() {
  return CALCULATOR_CATALOG.map((c) => ({ slug: c.slug }));
}

export default async function DashboardCalculatorsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!calculatorBySlug(slug)) notFound();

  return (
    <Suspense fallback={<p className="text-sm text-white/60">Loading calculator...</p>}>
      <CalculatorToolPage slug={slug} memberBasePath="/dashboard" />
    </Suspense>
  );
}
