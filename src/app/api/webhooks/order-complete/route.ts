import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import type { OrderWebhookPayload } from "@/lib/seller-order-provision";
import { provisionSellerFromPaidOrder } from "@/lib/seller-order-provision";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";
import { sendSetupAccountEmail } from "@/lib/transactional-email";

type CheckoutKind = "plan" | "upgrades";
type WebhookBody = OrderWebhookPayload & {
  checkoutSessionId?: string;
  checkoutKind?: CheckoutKind;
};

async function markSessionPaid(
  sessionId: string | undefined,
  kind: CheckoutKind,
  externalOrderId: string | undefined,
  purchaserEmail?: string,
  planId?: string,
) {
  const update = {
    $set: {
      ...(kind === "plan"
        ? { planPaid: true, planExternalOrderId: externalOrderId || null }
        : { upgradesPaid: true, upgradesExternalOrderId: externalOrderId || null }),
      lastWebhookAt: new Date(),
    },
  };
  const id = sessionId?.trim();
  if (id) {
    await PricingCheckoutSession.findOneAndUpdate({ sessionId: id }, update, { new: true });
    return;
  }
  const email = purchaserEmail?.trim().toLowerCase();
  const plan = planId?.trim();
  if (!email || !plan) return;
  await PricingCheckoutSession.findOneAndUpdate(
    { purchaserEmail: email, planId: plan },
    update,
    { sort: { updatedAt: -1 }, new: true },
  );
}

function normalizeSecret(req: Request): string | null {
  const header = req.headers.get("x-webhook-secret")?.trim();
  if (header) {
    return header;
  }
  const auth = req.headers.get("authorization")?.trim();
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

/**
 * Call from payment / CRM automation (e.g. GHL) when an order is paid.
 *
 * Creates or links the buyer user, records an ACTIVE PlanPurchase, and optionally creates a draft
 * Listing when `property` includes address, city, state, and zip.
 *
 * **Idempotency:** send the same `externalOrderId` on retries (payment processor transaction id).
 *
 * **New buyers:** response includes `setupAccountUrl` when `NEXTAUTH_URL` is set — use this in your
 * automation email so they can choose a password (until then the account has a placeholder hash).
 */
export async function POST(req: Request) {
  const expected = process.env.ORDER_WEBHOOK_SECRET?.trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "ORDER_WEBHOOK_SECRET is not configured." }, { status: 501 });
  }

  const provided = normalizeSecret(req);
  if (!provided || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = (await req.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  await connectDb();
  const checkoutKind: CheckoutKind = body.checkoutKind === "upgrades" ? "upgrades" : "plan";
  const externalOrderId = body.externalOrderId?.trim();

  try {
    if (checkoutKind === "upgrades") {
      await markSessionPaid(
        body.checkoutSessionId,
        checkoutKind,
        externalOrderId,
        body.contact?.email,
        body.plan?.id,
      );
      return NextResponse.json({
        ok: true,
        duplicate: false,
        checkoutKind,
        sessionUpdated: Boolean(body.checkoutSessionId?.trim()),
      });
    }

    const result = await provisionSellerFromPaidOrder(body);
    await markSessionPaid(
      body.checkoutSessionId,
      checkoutKind,
      externalOrderId,
      body.contact?.email,
      body.plan?.id,
    );
    if (result.status === "duplicate") {
      return NextResponse.json({ ok: true, duplicate: true, checkoutKind });
    }
    let setupEmailSent = false;
    let setupEmailError: string | null = null;
    if (result.createdUser && result.setupAccountUrl) {
      const email = body.contact?.email?.trim();
      if (!email) {
        setupEmailError = "Missing buyer email for setup email.";
      } else {
        const sent = await sendSetupAccountEmail({
          to: email,
          fullName: body.contact?.fullName,
          setupAccountUrl: result.setupAccountUrl,
        });
        setupEmailSent = sent.sent;
        setupEmailError = sent.sent ? null : sent.error ?? "Setup email send failed.";
      }
    }
    return NextResponse.json({
      ok: true,
      duplicate: false,
      checkoutKind,
      linkedToUser: result.linkedToUser,
      createdUser: result.createdUser,
      listingCreated: result.listingCreated,
      setupAccountUrl: result.setupAccountUrl ?? null,
      setupEmailSent,
      setupEmailError,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Provision failed.";
    const status = message.includes("required") ? 400 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
