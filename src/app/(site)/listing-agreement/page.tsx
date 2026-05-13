import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { ListingAgreementAcknowledge } from "@/components/listing-agreement-acknowledge";
import { UserAgreementContent } from "@/components/legal/user-agreement-content";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedUserAgreement } from "@/lib/user-agreement";

export const metadata: Metadata = {
  title: "User Agreement",
  description:
    "Acknowledge the ListQik.com User Agreement before continuing to your listing setup.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/listing-agreement",
  },
};

export default async function ListingAgreementPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/listing-agreement");
  }

  // Users who already clicked "I understand" never see the gate again.
  const acknowledged = await hasAcknowledgedUserAgreement(session.user.id);
  if (acknowledged) {
    redirect("/dashboard");
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-3">
            <div className="text-xs font-semibold tracking-widest text-emerald-300/80">
              STEP 4 OF 4 &middot; USER AGREEMENT
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Review the ListQik User Agreement.
            </h1>
            <p className="text-base text-muted">
              Before you set up your listing, please review how ListQik works with your Broker of
              Record. Confirm you understand the structure, then continue to your listing setup
              wizard.
            </p>
          </header>

          <section className="glass-surface-strong space-y-6 p-6 sm:p-8">
            <header className="space-y-1 border-b border-emerald-500/25 pb-4">
              <h2 className="text-xl font-semibold text-emerald-50">ListQik.com User Agreement</h2>
              <p className="text-xs text-white/55">
                Read each section. You can revisit this agreement later from the resources hub.
              </p>
            </header>
            <UserAgreementContent />
          </section>

          <section className="glass-surface space-y-4 p-5 sm:p-6">
            <ListingAgreementAcknowledge />
          </section>
        </div>
      </Container>
    </div>
  );
}
