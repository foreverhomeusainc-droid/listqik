import Stripe from "stripe";
import { connectDb } from "@/lib/mongodb";
import type { GoogleAdsPurchasePayload } from "@/lib/google-ads-config";
import { PlanPurchase } from "@/models/PlanPurchase";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";

function centsToDollars(raw: number | null | undefined): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return Math.round(raw) / 100;
}

export async function resolveGoogleAdsPurchaseFromStripeSession(
  stripeSessionId: string,
): Promise<GoogleAdsPurchasePayload | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;

  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
  if (session.payment_status !== "paid") return null;

  const value = centsToDollars(session.amount_total);
  if (value == null || value <= 0) return null;

  return {
    transactionId: session.id,
    value,
    currency: (session.currency || "usd").toUpperCase(),
  };
}

export async function resolveGoogleAdsPurchaseFromInternalSession(
  sessionId: string,
): Promise<GoogleAdsPurchasePayload | null> {
  await connectDb();

  const session = await PricingCheckoutSession.findOne({ sessionId }).lean();
  if (!session?.planPaid) return null;

  const externalOrderId = session.planExternalOrderId?.trim();
  if (!externalOrderId) return null;

  const purchase = await PlanPurchase.findOne({ externalOrderId })
    .select("externalOrderId amountTotal currency")
    .lean();
  if (purchase?.amountTotal && purchase.amountTotal > 0) {
    return {
      transactionId: purchase.externalOrderId || externalOrderId,
      value: purchase.amountTotal,
      currency: purchase.currency?.trim()?.toUpperCase() || "USD",
    };
  }

  if (externalOrderId.startsWith("cs_")) {
    return resolveGoogleAdsPurchaseFromStripeSession(externalOrderId);
  }

  return null;
}
