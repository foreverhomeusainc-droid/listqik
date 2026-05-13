import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { authOptions } from "@/lib/auth-options";
import { isAdminEmail } from "@/lib/admin";
import { hasAcknowledgedUserAgreement } from "@/lib/user-agreement";

export const metadata: Metadata = {
  title: "Listing Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }
  const isAdmin = isAdminEmail(session.user.email);

  // Seller accounts must acknowledge the ListQik User Agreement before entering
  // any /dashboard route. Admins manage the platform and bypass the gate.
  if (!isAdmin) {
    const acknowledged = await hasAcknowledgedUserAgreement(session.user.id);
    if (!acknowledged) {
      redirect("/listing-agreement");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),rgba(2,6,3,0.95)_55%)] text-emerald-100 antialiased">
      <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>
    </div>
  );
}
