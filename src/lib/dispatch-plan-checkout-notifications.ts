import {
  dispatchPostPurchaseAccountEmail,
  type PostPurchaseAccountEmailType,
} from "@/lib/dispatch-post-purchase-account-email";
import type { ProvisionSellerResult } from "@/lib/seller-order-provision";
import { sendInternalPlanPurchaseEmail } from "@/lib/transactional-email";

export type PlanCheckoutNotificationsResult = {
  accountEmailType: PostPurchaseAccountEmailType;
  accountEmailSent: boolean;
  accountEmailError: string | null;
  internalSent: boolean;
  internalError: string | null;
};

/**
 * Buyer account email + internal plan-purchase alert. Skips both on duplicate webhook retries.
 */
export async function dispatchPlanCheckoutNotifications(input: {
  email: string;
  fullName?: string;
  provision: ProvisionSellerResult;
  amountTotal?: number | null;
  orderRef?: string | null;
  couponCode?: string | null;
}): Promise<PlanCheckoutNotificationsResult> {
  const accountEmail = await dispatchPostPurchaseAccountEmail({
    email: input.email,
    fullName: input.fullName,
    provision: input.provision,
  });

  if (input.provision.status === "duplicate") {
    return {
      accountEmailType: accountEmail.type,
      accountEmailSent: accountEmail.sent,
      accountEmailError: accountEmail.error,
      internalSent: false,
      internalError: null,
    };
  }

  const internal = await sendInternalPlanPurchaseEmail({
    purchaserEmail: input.email,
    purchaserName: input.fullName ?? null,
    planName: input.provision.planLabel,
    propertyAddress: input.provision.propertyAddress,
    amountTotal: input.amountTotal ?? null,
    orderRef: input.orderRef ?? null,
    couponCode: input.couponCode ?? null,
    createdUser: input.provision.createdUser,
    listingCreated: input.provision.listingCreated,
  });

  if (!internal.sent) {
    console.error("[plan-checkout-email] internal notification not sent:", internal.error);
  }

  return {
    accountEmailType: accountEmail.type,
    accountEmailSent: accountEmail.sent,
    accountEmailError: accountEmail.error,
    internalSent: internal.sent,
    internalError: internal.sent ? null : internal.error ?? "Internal plan email send failed.",
  };
}
