import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import {
  computeVelocityClubSnapshot,
  previewTierAfterBundle,
} from "@/lib/loyalty/compute-loyalty-snapshot";
import { creditBundleBySlug, parseCreditBundlePriceMap } from "@/lib/loyalty/credit-bundles";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

function appBaseUrl(): string {
  const auth = process.env.NEXTAUTH_URL?.trim();
  if (auth) return auth.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "";
}

type Body = { bundleSlug?: string };

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) {
    return NextResponse.json({ ok: false, error: "STRIPE_SECRET_KEY is not configured." }, { status: 501 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const bundleSlug = body.bundleSlug?.trim() ?? "";
  const bundle = creditBundleBySlug(bundleSlug);
  if (!bundle) {
    return NextResponse.json({ ok: false, error: "Invalid bundle." }, { status: 400 });
  }

  const priceMap = parseCreditBundlePriceMap(process.env.STRIPE_CREDIT_BUNDLE_PRICE_IDS_JSON);
  const priceId = priceMap[bundle.slug];
  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: `Missing Stripe price for '${bundle.slug}'. Run npm run stripe:create-catalog and set STRIPE_CREDIT_BUNDLE_PRICE_IDS_JSON.`,
      },
      { status: 501 },
    );
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const user = await User.findById(userId).select("name email").lean();
  if (!user?.email) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  const snapshot = await computeVelocityClubSnapshot(userId);
  const tierPreview = previewTierAfterBundle(snapshot.effectiveCount, bundle.credits);

  const checkoutSessionId = randomUUID();
  const base = appBaseUrl();
  if (!base) {
    return NextResponse.json({ ok: false, error: "NEXTAUTH_URL or VERCEL_URL is required." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/dashboard/velocity-club?checkout=success&session_id=${encodeURIComponent(checkoutSessionId)}`,
    cancel_url: `${base}/dashboard/velocity-club?checkout=cancelled`,
    allow_promotion_codes: true,
    customer_email: user.email,
    client_reference_id: checkoutSessionId,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    metadata: {
      checkoutKind: "credit-bundle",
      checkoutSessionId,
      bundleSlug: bundle.slug,
      bundleName: bundle.name,
      bundleCredits: String(bundle.credits),
      buyerName: session.user.name?.trim() || user.name || "",
      buyerEmail: user.email,
      externalUserId: String(userId),
      tierPreviewName: tierPreview.tierName,
    },
  });

  return NextResponse.json({
    ok: true,
    checkoutUrl: stripeSession.url,
    tierPreview,
    bundle: {
      slug: bundle.slug,
      name: bundle.name,
      credits: bundle.credits,
      amountUsd: bundle.amountUsd,
    },
  });
}
