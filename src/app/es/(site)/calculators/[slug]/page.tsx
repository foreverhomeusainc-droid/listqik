import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { CalculatorToolPage } from "@/components/calculators/calculator-tool-page";
import { CALCULATOR_CATALOG, calculatorBySlug } from "@/lib/calculators/types";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/calculators", {
  title: "Calculadoras para inversionistas",
  description:
    "Calculadoras de fix & flip, rentas, multifamiliar, BRRRR, wholesale e hipoteca para inversionistas.",
});

export function generateStaticParams() {
  return CALCULATOR_CATALOG.map((c) => ({ slug: c.slug }));
}

export default async function EsCalculatorsSlugPage({
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
