import type { Metadata } from "next";
import { BuyersPageContent } from "@/components/buyers/buyers-page-content";
import { localeAlternates } from "@/lib/locale-metadata";

export const metadata: Metadata = {
  title: "Investor Buyer Deals",
  description:
    "MLS-sourced investor buyer deals for Texas operators. Teaser inventory plus comps after Buyer Representation Agreement.",
  alternates: localeAlternates("/buyers"),
};

export default function BuyersPage() {
  return <BuyersPageContent />;
}
