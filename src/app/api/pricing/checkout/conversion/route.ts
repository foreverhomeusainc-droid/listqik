import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDb } from "@/lib/mongodb";
import type { GoogleAdsPurchasePayload } from "@/lib/google-ads-config";
import { PlanPurchase } from "@/models/PlanPurchase";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";

function centsToDollars(raw: number | null | undefined): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return Math.round(raw) / 100;
}

async function payloadFromStripeSession(
  stripe: Stripe,
  stripeSessionId: string,
): Promise<GoogleAdsPurchasePayload | null> {
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

async function payloadFromInternalSession(
  sessionId: string,
): Promise<GoogleAdsPurchasePayload | null> {
  await connectDb();

  const session = await PricingCheckoutSession.findOne({ sessionId }).lean();
  if (!session?.planPaid) return null;

  const externalOrderId = session.planExternalOrderId?.trim();
  if (externalOrderId) {
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

    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (key) {
      const stripe = new Stripe(key);
      return payloadFromStripeSession(stripe, externalOrderId);
    }
  }

  return null;
}

/** Resolves paid plan purchase data for Google Ads conversion firing (no PII). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stripeSessionId = searchParams.get("stripeSessionId")?.trim();
  const sessionId = searchParams.get("sessionId")?.trim();

  if (!stripeSessionId && !sessionId) {
    return NextResponse.json(
      { ok: false, error: "stripeSessionId or sessionId is required." },
      { status: 400 },
    );
  }

  try {
    let purchase: GoogleAdsPurchasePayload | null = null;

    if (stripeSessionId) {
      const key = process.env.STRIPE_SECRET_KEY?.trim();
      if (!key) {
        return NextResponse.json(
          { ok: false, error: "Stripe is not configured." },
          { status: 501 },
        );
      }
      const stripe = new Stripe(key);
      purchase = await payloadFromStripeSession(stripe, stripeSessionId);
    } else if (sessionId) {
      purchase = await payloadFromInternalSession(sessionId);
    }

    if (!purchase) {
      return NextResponse.json(
        { ok: false, error: "Paid purchase not found for this session." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, purchase });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion lookup failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
