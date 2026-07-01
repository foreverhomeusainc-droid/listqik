import { BuyerDealDetailConsole } from "@/components/buyers/buyer-deal-detail-console";

export default async function BuyerDealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BuyerDealDetailConsole dealId={id} />;
}
