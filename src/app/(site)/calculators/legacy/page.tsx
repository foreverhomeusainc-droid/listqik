import type { Metadata } from "next";
import { Container } from "@/components/container";
import { LegacyCalculatorHub } from "@/components/calculators/legacy/legacy-calculator-hub";

export const metadata: Metadata = {
  title: "Legacy Calculators (OLD)",
  description: "Archived Phase 2 deal analyzers kept for reference.",
};

export default function LegacyCalculatorsPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <LegacyCalculatorHub basePath="/calculators/legacy" />
      </Container>
    </main>
  );
}
