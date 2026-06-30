import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { BuyerDashboardDemo } from "@/components/buyers/buyer-dashboard-demo";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { buyersDemoPath, isValidBuyersDemoKey } from "@/lib/buyers/demo-access";

export const metadata: Metadata = {
  title: "Buyer Dashboard Demo",
  description: "Temporary investor demo for Buyer Representation and MLS buyer deals.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function BuyerDashboardDemoPage({ searchParams }: PageProps) {
  const { key } = await searchParams;
  if (!isValidBuyersDemoKey(key)) {
    notFound();
  }

  const demoPath = buyersDemoPath(key!.trim());
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(demoPath)}`);
  }

  const hasBuyerRep = await hasAcknowledgedBuyerRep(session.user.id);

  return <BuyerDashboardDemo hasBuyerRep={hasBuyerRep} demoPath={demoPath} />;
}
