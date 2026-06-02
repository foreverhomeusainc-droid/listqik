import {
  sendFullServiceCheckoutConfirmationEmail,
  sendInternalFullServiceCheckoutEmail,
} from "@/lib/transactional-email";

export async function dispatchFullServiceCheckoutEmails(input: {
  tierName: string;
  listingCommissionPercent: number;
  buyerEmail: string;
  buyerName?: string;
  amountTotalUsd: number | null;
  stripeSessionId: string;
}) {
  const payload = {
    purchaserEmail: input.buyerEmail,
    purchaserName: input.buyerName ?? null,
    tierName: input.tierName,
    listingCommissionPercent: input.listingCommissionPercent,
    amountTotal: input.amountTotalUsd,
    orderRef: input.stripeSessionId,
  };

  const [buyer, internal] = await Promise.all([
    sendFullServiceCheckoutConfirmationEmail(payload),
    sendInternalFullServiceCheckoutEmail(payload),
  ]);

  if (!buyer.sent) {
    console.error("[full-service-checkout-email] buyer confirmation not sent:", buyer.error);
  }
  if (!internal.sent) {
    console.error("[full-service-checkout-email] internal notification not sent:", internal.error);
  }

  return {
    buyerSent: buyer.sent,
    internalSent: internal.sent,
    buyerError: buyer.error,
    internalError: internal.error,
  };
}
