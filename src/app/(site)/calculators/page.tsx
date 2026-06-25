import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CalculatorHub } from "@/components/calculators/calculator-hub";

export const metadata: Metadata = {
  title: "Investor Calculators",
  description: "Free real estate investor calculators with ListQik margin comparison.",
};

export default function PublicCalculatorsPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <CalculatorHub basePath="/calculators" />
      </Container>
    </main>
  );
}
