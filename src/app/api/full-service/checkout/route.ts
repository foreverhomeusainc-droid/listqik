import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { FULL_SERVICE_STRIPE_CATALOG } from "@/data/full-service-stripe-catalog";
import type { FullServiceTierId } from "@/i18n/full-service-copy";
import { localeSitePath } from "@/lib/locale-site-path";
import type { HomeLocale } from "@/i18n/home-locale";

type Body = {
  tierId?: string;
  locale?: string;
};

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

function appBaseUrl(): string {
  const auth = process.env.NEXTAUTH_URL?.trim();
  if (auth) return auth.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "";
}

function parseLocale(raw: string | undefined): HomeLocale {
  return raw?.trim().toLowerCase() === "es" ? "es" : "en";
}

const VALID_TIER_IDS = new Set<FullServiceTierId>(
  FULL_SERVICE_STRIPE_CATALOG.map((row) => row.slug),
);

export async function POST(req: Request) {
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

  const tierId = String(body.tierId ?? "").trim() as FullServiceTierId;
  if (!VALID_TIER_IDS.has(tierId)) {
    return NextResponse.json({ ok: false, error: "Invalid full-service tier." }, { status: 400 });
  }

  const catalogRow = FULL_SERVICE_STRIPE_CATALOG.find((row) => row.slug === tierId);
  if (!catalogRow) {
    return NextResponse.json({ ok: false, error: "Tier not found." }, { status: 400 });
  }

  const priceMap = parseStringMap(process.env.STRIPE_FULL_SERVICE_PRICE_IDS_JSON);
  const priceId = priceMap[tierId];
  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: `Missing Stripe price for '${tierId}'. Run npm run stripe:create-catalog and set STRIPE_FULL_SERVICE_PRICE_IDS_JSON.`,
      },
      { status: 400 },
    );
  }

  const base = appBaseUrl();
  if (!base) {
    return NextResponse.json({ ok: false, error: "NEXTAUTH_URL or VERCEL_URL is required." }, { status: 500 });
  }

  const locale = parseLocale(body.locale);
  const fullServicePath = localeSitePath("/full-service", locale);
  const checkoutSessionId = randomUUID();
  const stripe = new Stripe(stripeKey);

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}${fullServicePath}?checkout=success`,
    cancel_url: `${base}${fullServicePath}?checkout=cancelled`,
    allow_promotion_codes: true,
    client_reference_id: checkoutSessionId,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    metadata: {
      checkoutKind: "full-service",
      checkoutSessionId,
      fullServiceTierId: tierId,
      fullServiceTierName: catalogRow.name,
      listingCommissionPercent: String(catalogRow.listingCommissionPercent),
    },
  });

  return NextResponse.json({
    ok: true,
    checkoutUrl: stripeSession.url || null,
    checkoutSessionId,
  });
}
