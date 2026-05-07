import type { Metadata } from "next";
import { Step3CartLab } from "@/components/pricing/step3-cart-lab";

export const metadata: Metadata = {
  title: "Step 3 Cart Lab",
  description: "Internal tester page for GHL dynamic upgrades checkout cart behavior.",
  robots: { index: false, follow: false },
};

export default function Step3LabPage() {
  return <Step3CartLab />;
}
