import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { authOptions } from "@/lib/auth-options";
import { isAdminEmail } from "@/lib/admin";
import { isBuyerOnlyDashboardPath } from "@/lib/buyers/dashboard-paths";
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

  const pathname = (await headers()).get("x-listqik-pathname") ?? "";
  const buyerOnlyRoute = isBuyerOnlyDashboardPath(pathname);

  if (!isAdmin && !buyerOnlyRoute) {
    const acknowledged = await hasAcknowledgedUserAgreement(session.user.id);
    if (!acknowledged) {
      redirect("/listing-agreement");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),rgba(2,6,3,0.95)_55%)] text-emerald-100 antialiased">
      <DashboardShell isAdmin={isAdmin} buyerMode={buyerOnlyRoute}>
        {children}
      </DashboardShell>
    </div>
  );
}
