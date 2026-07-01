import type { Metadata } from "next";
import { BuyerRegisterForm } from "@/components/buyers/buyer-register-form";
import { englishOnlyAlternates } from "@/lib/locale-metadata";

export const metadata: Metadata = {
  title: "Request Buyer Access | ListQik",
  description: "Request a buyer account to access MLS deals, comps, and the investor buyer dashboard.",
  alternates: englishOnlyAlternates("/buyers/register"),
};

export default function BuyerRegisterPage() {
  return <BuyerRegisterForm />;
}
