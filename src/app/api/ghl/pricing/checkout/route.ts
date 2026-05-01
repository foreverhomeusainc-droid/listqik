import { NextResponse } from "next/server";
import { createGhlClient } from "@/lib/ghl-client";

type CheckoutPayload = {
  source?: string;
  plan?: {
    id?: string;
    name?: string;
    price?: string;
    closeFee?: string;
  };
  contact?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  property?: {
    address?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    propertyType?: string;
  };
  upgrades?: Array<{
    slug?: string;
    name?: string;
    price?: number;
    ghlProductId?: string;
  }>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parsePlanProductIds(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[key] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

function parseStringMap(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[key] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

async function firstPriceIdForProduct(productId: string): Promise<string | null> {
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  const ghl = createGhlClient();
  if (!locationId || !ghl) return null;
  try {
    const prices = await ghl.products.listPricesForProduct(
      { productId, locationId, limit: 10, offset: 0 },
      { preferredTokenType: "location" },
    );
    const first = prices.prices?.[0];
    return first?._id ?? null;
  } catch {
    return null;
  }
}

async function priceIdsForProduct(productId: string): Promise<string[]> {
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  const ghl = createGhlClient();
  if (!locationId || !ghl) return [];
  try {
    const prices = await ghl.products.listPricesForProduct(
      { productId, locationId, limit: 50, offset: 0 },
      { preferredTokenType: "location" },
    );
    return (prices.prices ?? []).map((p) => p._id).filter((v): v is string => Boolean(v));
  } catch {
    return [];
  }
}

function parseUsdAmount(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!isObject(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const payload = body as CheckoutPayload;
  const planSlug = payload.plan?.id?.trim();
  const name = payload.contact?.fullName?.trim();
  const email = payload.contact?.email?.trim();
  const phone = payload.contact?.phone?.trim();
  const address = payload.property?.address?.trim();
  const propertyType = payload.property?.propertyType?.trim();

  if (!name || !email || !phone || !address || !propertyType || !planSlug) {
    return NextResponse.json(
      { ok: false, error: "Missing required plan/contact/property fields." },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.GHL_PRICING_WEBHOOK_URL;
  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        receivedAt: new Date().toISOString(),
        userAgent: req.headers.get("user-agent") ?? undefined,
      }),
    });

    if (!webhookRes.ok) {
      const details = await webhookRes.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: "GHL pricing webhook failed.",
          status: webhookRes.status,
          details,
        },
        { status: 502 },
      );
    }
  }

  const checkoutBase = process.env.GHL_STORE_CHECKOUT_BASE_URL;

  const planProductIds = parsePlanProductIds(process.env.GHL_PLAN_PRODUCT_IDS);
  const planProductId = planProductIds[planSlug];
  const upgradePriceIdsMap = parseStringMap(process.env.GHL_UPGRADE_PRICE_IDS);
  const planPriceIdsMap = parseStringMap(process.env.GHL_PLAN_PRICE_IDS);
  const productPriceCache = new Map<string, string[]>();

  let planPriceId: string | undefined = planPriceIdsMap[planSlug];
  if (!planPriceId && planProductId) {
    planPriceId = (await firstPriceIdForProduct(planProductId)) || undefined;
  }

  const upgradePriceIds: string[] = [];
  for (const upgrade of payload.upgrades ?? []) {
    const slug = upgrade.slug?.trim();
    const productId = upgrade.ghlProductId?.trim();
    let priceId: string | undefined;
    const mapped = slug ? upgradePriceIdsMap[slug] : undefined;
    if (productId) {
      let knownPriceIds = productPriceCache.get(productId);
      if (!knownPriceIds) {
        knownPriceIds = await priceIdsForProduct(productId);
        productPriceCache.set(productId, knownPriceIds);
      }
      if (mapped && knownPriceIds.includes(mapped)) {
        priceId = mapped;
      } else if (knownPriceIds.length > 0) {
        priceId = knownPriceIds[0];
      } else {
        priceId = (await firstPriceIdForProduct(productId)) ?? undefined;
      }
    } else if (mapped) {
      priceId = mapped;
    }
    if (priceId) upgradePriceIds.push(priceId);
  }

  const products = [...new Set([planPriceId, ...upgradePriceIds].filter(Boolean))];

  const locationId = process.env.GHL_LOCATION_ID?.trim();
  const ghl = createGhlClient();
  const planAmount = parseUsdAmount(payload.plan?.price);

  if (ghl && locationId && planPriceId && planAmount != null) {
    const items: Array<{
      name: string;
      productId?: string;
      priceId?: string;
      currency: string;
      amount: number;
      qty: number;
    }> = [
      {
        name: payload.plan?.name?.trim() || planSlug,
        productId: planProductId,
        priceId: planPriceId,
        currency: "USD",
        amount: planAmount,
        qty: 1,
      },
      ...(payload.upgrades ?? []).map((u, idx) => ({
        name: u.name?.trim() || `Upgrade ${idx + 1}`,
        productId: u.ghlProductId?.trim() || undefined,
        priceId: upgradePriceIds[idx],
        currency: "USD",
        amount:
          typeof u.price === "number" && Number.isFinite(u.price) && u.price > 0
            ? Math.round(u.price * 100) / 100
            : 0,
        qty: 1,
      })),
    ].filter((i) => i.priceId);

    try {
      const invoiceRes = await ghl.invoices.text2payInvoice(
        {
          altId: locationId,
          altType: "location",
          name: `${payload.plan?.name || planSlug} checkout`,
          currency: "USD",
          items,
          termsNotes: "Created from pricing wizard checkout.",
          title: `ListQik - ${payload.plan?.name || planSlug}`,
          contactDetails: {
            name,
            phoneNo: phone,
            email,
            address: {
              addressLine1: address,
              addressLine2: payload.property?.unit?.trim() || undefined,
              city: payload.property?.city?.trim() || undefined,
              state: payload.property?.state?.trim() || undefined,
              postalCode: payload.property?.zip?.trim() || undefined,
              countryCode: "US",
            },
          },
          sentTo: { email: [email] },
          liveMode: true,
          action: "send",
          // Optional in practice for many sub-accounts; if required by your location,
          // set GHL_INVOICE_USER_ID and we will pass that instead.
          userId: process.env.GHL_INVOICE_USER_ID?.trim() || undefined,
        } as never,
        { __preferredTokenType: "location" } as never,
      );

      if ((invoiceRes as { invoiceUrl?: string }).invoiceUrl) {
        return NextResponse.json({
          ok: true,
          checkoutUrl: (invoiceRes as { invoiceUrl: string }).invoiceUrl,
          mode: "invoice",
        });
      }
    } catch (e) {
      const details = e instanceof Error ? e.message : "Invoice checkout creation failed.";
      if (!checkoutBase) {
        return NextResponse.json(
          { ok: false, error: "GHL invoice checkout failed.", details },
          { status: 502 },
        );
      }
    }
  }

  if (!checkoutBase) {
    return NextResponse.json({
      ok: true,
      checkoutUrl: null,
      warning: "Set GHL_STORE_CHECKOUT_BASE_URL to enable fallback checkout redirect.",
    });
  }

  const url = new URL(checkoutBase);
  url.searchParams.set("plan", planSlug);
  url.searchParams.set("name", name);
  url.searchParams.set("email", email);
  url.searchParams.set("phone", phone);
  url.searchParams.set("address", address);
  url.searchParams.set("propertyType", propertyType);
  if (products.length > 0) {
    url.searchParams.set("products", products.join(","));
  }

  return NextResponse.json({
    ok: true,
    checkoutUrl: url.toString(),
    mode: "legacy-url",
    warning:
      !planPriceId
        ? `No mapped plan price id for '${planSlug}'. Set GHL_PLAN_PRICE_IDS or ensure GHL plan products have prices.`
        : undefined,
  });
}

