import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CalculatorHub } from "@/components/calculators/calculator-hub";
import { buildLocalizedMetadata } from "@/lib/locale-metadata";

export const metadata: Metadata = buildLocalizedMetadata("es", "/calculators", {
  title: "Calculadoras para inversionistas",
  description: "Calculadoras gratuitas de bienes raíces con comparación de márgenes ListQik.",
});

export default function EsCalculatorsPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <CalculatorHub basePath="/es/calculators" />
      </Container>
    </main>
  );
}
