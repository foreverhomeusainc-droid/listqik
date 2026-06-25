import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { CalculatorToolPage } from "@/components/calculators/calculator-tool-page";
import { CALCULATOR_CATALOG, calculatorBySlug } from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Investor Calculators",
  description:
    "Fix & flip, rental, multifamily, BRRRR, wholesale, and mortgage calculators for real estate investors.",
};

export function generateStaticParams() {
  return CALCULATOR_CATALOG.map((c) => ({ slug: c.slug }));
}

export default async function PublicCalculatorsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!calculatorBySlug(slug)) notFound();

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <Suspense fallback={<p className="text-sm text-white/60">Loading calculator...</p>}>
          <CalculatorToolPage slug={slug} memberBasePath="/dashboard" />
        </Suspense>
      </Container>
    </main>
  );
}
