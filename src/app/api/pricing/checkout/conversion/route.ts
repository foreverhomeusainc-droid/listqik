import { NextResponse } from "next/server";
import {
  resolveGoogleAdsPurchaseFromInternalSession,
  resolveGoogleAdsPurchaseFromStripeSession,
} from "@/lib/google-ads-purchase-resolve";

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
    let purchase = null;

    if (stripeSessionId) {
      if (!process.env.STRIPE_SECRET_KEY?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Stripe is not configured." },
          { status: 501 },
        );
      }
      purchase = await resolveGoogleAdsPurchaseFromStripeSession(stripeSessionId);
    } else if (sessionId) {
      purchase = await resolveGoogleAdsPurchaseFromInternalSession(sessionId);
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
