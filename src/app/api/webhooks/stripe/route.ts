import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Types } from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { provisionSellerFromPaidOrder } from "@/lib/seller-order-provision";
import { extractStripeCheckoutCouponCode } from "@/lib/stripe-purchase-details";
import { FULL_SERVICE_STRIPE_CATALOG } from "@/data/full-service-stripe-catalog";
import { dispatchFullServiceCheckoutEmails } from "@/lib/dispatch-full-service-checkout-email";
import { dispatchPlanCheckoutNotifications } from "@/lib/dispatch-plan-checkout-notifications";
import { dispatchUpgradePurchaseEmails } from "@/lib/dispatch-upgrade-purchase-emails";
import { resolveUpgradeSlugs } from "@/lib/stripe-upgrade-slugs";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";
import { UpgradePurchase } from "@/models/UpgradePurchase";
import { User } from "@/models/User";
import { fulfillListingCreditBundle } from "@/lib/loyalty/fulfill-credit-bundle";

function parseStringMap(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[key.trim()] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

function toNumCentsToDollars(cents: number | null | undefined): number | null {
  if (typeof cents !== "number" || !Number.isFinite(cents)) return null;
  return Math.round(cents) / 100;
}

async function markSessionPaid(
  sessionId: string,
  kind: "plan" | "upgrades",
  externalOrderId: string,
) {
  await PricingCheckoutSession.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        ...(kind === "plan"
          ? { planPaid: true, planExternalOrderId: externalOrderId }
          : { upgradesPaid: true, upgradesExternalOrderId: externalOrderId }),
        lastWebhookAt: new Date(),
      },
    },
    { new: true },
  );
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!key || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are required." },
      { status: 501 },
    );
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ ok: true, ignored: true, event: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata ?? {};
  const checkoutKindRaw = (metadata.checkoutKind || "plan").trim();
  const checkoutSessionId = (metadata.checkoutSessionId || session.client_reference_id || "").trim();

  await connectDb();

  const externalOrderId = session.id;

  if (checkoutKindRaw === "credit-bundle") {
    const bundleSlug = (metadata.bundleSlug || "").trim();
    const externalUserId = (metadata.externalUserId || "").trim();
    if (!bundleSlug || !externalUserId || !Types.ObjectId.isValid(externalUserId)) {
      return NextResponse.json(
        { ok: false, error: "credit-bundle requires bundleSlug and externalUserId." },
        { status: 400 },
      );
    }

    const result = await fulfillListingCreditBundle({
      userId: new Types.ObjectId(externalUserId),
      bundleSlug,
      externalOrderId,
      checkoutSessionId: checkoutSessionId || undefined,
      amountTotalUsd: toNumCentsToDollars(session.amount_total),
    });

    return NextResponse.json({
      ok: true,
      event: event.type,
      checkoutKind: "credit-bundle",
      externalOrderId,
      duplicate: result.status === "duplicate",
      creditsAdded: result.creditsAdded,
    });
  }

  if (checkoutKindRaw === "full-service") {
    const tierId = (metadata.fullServiceTierId || "").trim();
    const catalogRow = FULL_SERVICE_STRIPE_CATALOG.find((row) => row.slug === tierId);
    const tierName =
      metadata.fullServiceTierName?.trim() || catalogRow?.name || tierId || "Full Service";
    const commissionRaw = metadata.listingCommissionPercent || "";
    const listingCommissionPercent = Number(commissionRaw) || catalogRow?.listingCommissionPercent || 0;

    const buyerEmail = (session.customer_details?.email || "").trim().toLowerCase();
    const buyerName = session.customer_details?.name || undefined;

    let emailResult = { buyerSent: false, internalSent: false, buyerError: undefined as string | undefined, internalError: undefined as string | undefined };
    if (buyerEmail) {
      emailResult = await dispatchFullServiceCheckoutEmails({
        tierName,
        listingCommissionPercent,
        buyerEmail,
        buyerName,
        amountTotalUsd: toNumCentsToDollars(session.amount_total),
        stripeSessionId: externalOrderId,
      });
    }

    return NextResponse.json({
      ok: true,
      event: event.type,
      checkoutKind: "full-service",
      checkoutSessionId: checkoutSessionId || null,
      externalOrderId,
      tierId,
      fullServiceEmailsSent: Boolean(emailResult.buyerSent && emailResult.internalSent),
      fullServiceEmailError:
        [emailResult.buyerError, emailResult.internalError].filter(Boolean).join("; ") || null,
    });
  }

  if (!checkoutSessionId) {
    return NextResponse.json({ ok: false, error: "Missing checkoutSessionId metadata." }, { status: 400 });
  }

  const checkoutKind: "plan" | "upgrades" = checkoutKindRaw === "upgrades" ? "upgrades" : "plan";
  await markSessionPaid(checkoutSessionId, checkoutKind, externalOrderId);

  if (checkoutKind === "plan") {
    const paidOrder = await provisionSellerFromPaidOrder({
      externalOrderId,
      contact: {
        email: metadata.buyerEmail || session.customer_details?.email || undefined,
        fullName: metadata.buyerName || session.customer_details?.name || undefined,
        phone: metadata.buyerPhone || session.customer_details?.phone || undefined,
      },
      plan: {
        id: metadata.planId || undefined,
        name: metadata.planName || undefined,
        price: metadata.planPrice || undefined,
        closeFee: metadata.closeFee || undefined,
      },
      property: {
        address: metadata.propertyAddress || undefined,
        unit: metadata.propertyUnit || undefined,
        city: metadata.propertyCity || undefined,
        state: metadata.propertyState || undefined,
        zip: metadata.propertyZip || undefined,
        county: metadata.propertyCounty || undefined,
        propertyType: metadata.propertyType || undefined,
      },
      upgrades: [],
      payment: {
        currency: session.currency || null,
        amountTotal: toNumCentsToDollars(session.amount_total),
        paymentStatus: session.payment_status || null,
        couponCode: extractStripeCheckoutCouponCode(session),
      },
    });

    const email = (metadata.buyerEmail || session.customer_details?.email || "").trim();
    const emailResult = await dispatchPlanCheckoutNotifications({
      email,
      fullName: metadata.buyerName || session.customer_details?.name || undefined,
      provision: paidOrder,
      amountTotal: toNumCentsToDollars(session.amount_total),
      orderRef: externalOrderId,
      couponCode: extractStripeCheckoutCouponCode(session) ?? undefined,
    });
    const accountEmailType = emailResult.accountEmailType;
    const accountEmailSent = emailResult.accountEmailSent;
    const accountEmailError = emailResult.accountEmailError;
    const internalPlanEmailSent = emailResult.internalSent;
    const internalPlanEmailError = emailResult.internalError;

    return NextResponse.json({
      ok: true,
      event: event.type,
      checkoutKind,
      checkoutSessionId,
      externalOrderId,
      duplicate: paidOrder.status === "duplicate",
      accountEmailType,
      accountEmailSent,
      accountEmailError,
      internalPlanEmailSent,
      internalPlanEmailError,
    });
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  const upgradePriceMap = parseStringMap(process.env.STRIPE_UPGRADE_PRICE_IDS_JSON);
  const reverse = new Map<string, string>();
  for (const [slug, priceId] of Object.entries(upgradePriceMap)) {
    reverse.set(priceId, slug);
  }

  const upgradeSlugs = resolveUpgradeSlugs(metadata, lineItems.data, reverse);

  if (upgradeSlugs.length > 0) {
    const externalUserId = (metadata.externalUserId || "").trim();
    const buyerEmail = (metadata.buyerEmail || session.customer_details?.email || "").trim().toLowerCase();
    if (externalUserId && Types.ObjectId.isValid(externalUserId)) {
      await User.updateOne(
        { _id: externalUserId },
        { $addToSet: { purchasedUpgradeSlugs: { $each: upgradeSlugs } } },
      );
    } else if (buyerEmail) {
      await User.updateOne(
        { email: buyerEmail },
        { $addToSet: { purchasedUpgradeSlugs: { $each: upgradeSlugs } } },
      );
    }
  }

  const purchaserEmail = (
    metadata.buyerEmail ||
    session.customer_details?.email ||
    ""
  )
    .trim()
    .toLowerCase();

  const existing = await UpgradePurchase.findOne({ externalOrderId })
    .select("_id emailsSentAt")
    .lean();

  if (!existing?._id) {
    await UpgradePurchase.create({
      purchaserEmail: purchaserEmail || null,
      externalUserId: metadata.externalUserId || null,
      checkoutSessionId,
      externalOrderId,
      paymentStatus: session.payment_status || null,
      currency: session.currency || null,
      amountTotal: toNumCentsToDollars(session.amount_total),
      purchasedAt: new Date(),
      upgradeSlugs,
      items: lineItems.data.map((row) => ({
        name: row.description || "",
        slug: reverse.get(row.price?.id || "") || "",
        priceId: row.price?.id || "",
        productId: typeof row.price?.product === "string" ? row.price.product : "",
        quantity: row.quantity || 1,
        amount: toNumCentsToDollars(row.amount_total),
        raw: row,
      })),
      rawPayload: session,
    });
  }

  let upgradeEmailsSent = false;
  let upgradeEmailError: string | undefined;

  const shouldSendUpgradeEmails =
    purchaserEmail.length > 0 && upgradeSlugs.length > 0 && !existing?.emailsSentAt;

  if (shouldSendUpgradeEmails) {
    try {
      let purchaserName = metadata.buyerName || session.customer_details?.name || null;
      const externalUserId = (metadata.externalUserId || "").trim();
      if (externalUserId && Types.ObjectId.isValid(externalUserId)) {
        const user = await User.findById(externalUserId).select("name").lean();
        if (user?.name) purchaserName = user.name;
      } else {
        const user = await User.findOne({ email: purchaserEmail }).select("name").lean();
        if (user?.name) purchaserName = user.name;
      }

      const emailResult = await dispatchUpgradePurchaseEmails({
        purchaserEmail,
        purchaserName,
        upgradeSlugs,
        amountTotal: toNumCentsToDollars(session.amount_total),
        orderRef: externalOrderId,
      });

      upgradeEmailsSent = Boolean(emailResult?.buyerSent || emailResult?.internalSent);
      if (!emailResult?.buyerSent || !emailResult?.internalSent) {
        upgradeEmailError = [
          !emailResult?.buyerSent ? emailResult?.buyerError : null,
          !emailResult?.internalSent ? emailResult?.internalError : null,
        ]
          .filter(Boolean)
          .join("; ");
      }

      if (upgradeEmailsSent) {
        await UpgradePurchase.updateOne(
          { externalOrderId },
          { $set: { emailsSentAt: new Date() } },
        );
      }
    } catch (err) {
      upgradeEmailError = err instanceof Error ? err.message : "Upgrade email dispatch failed.";
      console.error("[stripe-webhook] upgrade purchase email failed:", upgradeEmailError);
    }
  }

  return NextResponse.json({
    ok: true,
    event: event.type,
    checkoutKind,
    checkoutSessionId,
    externalOrderId,
    upgradesCount: upgradeSlugs.length,
    upgrades: upgradeSlugs,
    upgradeEmailsSent,
    upgradeEmailError: upgradeEmailError ?? null,
  });
}
