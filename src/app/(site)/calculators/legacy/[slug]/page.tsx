import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { LegacyCalculatorToolPage } from "@/components/calculators/legacy/legacy-calculator-tool-page";
import { LEGACY_CALCULATOR_CATALOG, legacyCalculatorBySlug } from "@/lib/calculators/types";

export const metadata: Metadata = {
  title: "Legacy Calculator (OLD)",
  description: "Archived investor calculator kept for reference.",
};

export function generateStaticParams() {
  return LEGACY_CALCULATOR_CATALOG.map((c) => ({ slug: c.slug }));
}

export default async function LegacyCalculatorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!legacyCalculatorBySlug(slug)) notFound();

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <Suspense fallback={<p className="text-sm text-white/60">Loading calculator...</p>}>
          <LegacyCalculatorToolPage slug={slug} memberBasePath="/dashboard/calculators/legacy" />
        </Suspense>
      </Container>
    </main>
  );
}
