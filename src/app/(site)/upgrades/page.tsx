import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Listing Upgrades",
  description: "Browse and purchase optional listing upgrades.",
  alternates: {
    canonical: "/upgrades",
  },
};

export default function UpgradesPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container className="space-y-5">
        <header className="rounded-2xl border border-emerald-500/25 bg-black/40 p-5">
          <h1 className="text-2xl font-semibold text-white">Listing Upgrades</h1>
          <p className="mt-2 text-sm text-white/75">
            Select any add-ons you want for your listing from the catalog below.
          </p>
        </header>

        <section className="rounded-2xl border border-white/15 bg-black/30 p-3">
          <iframe
            title="ListQik upgrades catalog"
            src="https://checkout.listqik.com/products-list"
            className="h-[80vh] min-h-[700px] w-full rounded-xl border border-white/15 bg-black/20"
            loading="lazy"
          />
        </section>
      </Container>
    </div>
  );
}
