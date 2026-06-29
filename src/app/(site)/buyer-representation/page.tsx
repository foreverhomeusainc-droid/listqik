import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { BuyerRepAcknowledge } from "@/components/buyers/buyer-rep-acknowledge";
import { BuyerRepresentationContent } from "@/components/legal/buyer-representation-content";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";

export const metadata: Metadata = {
  title: "Buyer Representation Agreement",
  description: "Sign Buyer Representation to access MLS investor deals and comps.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/buyer-representation" },
};

export default async function BuyerRepresentationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/buyer-representation");
  }

  const acknowledged = await hasAcknowledgedBuyerRep(session.user.id);
  if (acknowledged) {
    redirect("/dashboard/buyers");
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-3">
            <div className="text-xs font-semibold tracking-widest text-sky-300/80">
              INVESTOR BUYERS · REPRESENTATION
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Buyer Representation Agreement
            </h1>
            <p className="text-base text-muted">
              Unlock the full MLS buyer deal feed, private remarks, and comps engine after you
              acknowledge buyer representation with Central Metro Realty.
            </p>
          </header>

          <section className="glass-surface-strong space-y-6 p-6 sm:p-8">
            <BuyerRepresentationContent />
          </section>

          <section className="glass-surface space-y-4 p-5 sm:p-6">
            <BuyerRepAcknowledge />
          </section>
        </div>
      </Container>
    </div>
  );
}
