import { NextResponse } from "next/server";
import { createGhlClient } from "@/lib/ghl-client";
import { connectDb } from "@/lib/mongodb";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";

type CheckoutPayload = {
  source?: string;
  checkoutSessionId?: string;
  checkoutKind?: "plan" | "upgrades";
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

function splitNameParts(fullName: string): { firstName: string; lastName?: string } {
  const cleaned = fullName.trim().replace(/\s+/g, " ");
  if (!cleaned) return { firstName: "Customer" };
  const [first, ...rest] = cleaned.split(" ");
  const last = rest.join(" ").trim();
  return {
    firstName: first || "Customer",
    lastName: last || undefined,
  };
}

async function upsertGhlContact(args: {
  locationId: string;
  apiVersion: string;
  token: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}): Promise<{ ok: true; contactId?: string } | { ok: false; error: string }> {
  const { firstName, lastName } = splitNameParts(args.fullName);
  const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.token}`,
      Version: args.apiVersion,
      "content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      locationId: args.locationId,
      firstName,
      lastName,
      name: args.fullName,
      email: args.email,
      phone: args.phone,
      address1: args.addressLine1,
      address2: args.addressLine2,
      city: args.city,
      state: args.state,
      postalCode: args.postalCode,
      country: "US",
      source: "ListQik pricing checkout",
    }),
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Contact upsert failed (${res.status}). ${details || "No response body."}`,
    };
  }

  const data = (await res.json().catch(() => null)) as
    | { contact?: { id?: string; _id?: string } }
    | null;
  return {
    ok: true,
    contactId: data?.contact?.id || data?.contact?._id,
  };
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
  const checkoutSessionId = payload.checkoutSessionId?.trim();
  const checkoutKind: "plan" | "upgrades" = payload.checkoutKind === "upgrades" ? "upgrades" : "plan";
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
        checkoutKind,
        checkoutSessionId,
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
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  const privateToken = process.env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim();
  const apiVersion = process.env.GHL_API_VERSION?.trim() || "2021-07-28";

  let contactUpsertWarning: string | undefined;
  if (privateToken && locationId) {
    const contactResult = await upsertGhlContact({
      locationId,
      apiVersion,
      token: privateToken,
      fullName: name,
      email,
      phone,
      addressLine1: address,
      addressLine2: payload.property?.unit?.trim() || undefined,
      city: payload.property?.city?.trim() || undefined,
      state: payload.property?.state?.trim() || undefined,
      postalCode: payload.property?.zip?.trim() || undefined,
    });
    if (!contactResult.ok) {
      contactUpsertWarning = contactResult.error;
    }
  } else {
    contactUpsertWarning =
      "GHL contact upsert skipped (missing GHL_PRIVATE_INTEGRATION_TOKEN or GHL_LOCATION_ID).";
  }

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
  const planAmount = parseUsdAmount(payload.plan?.price);
  const includePlanItem = checkoutKind === "plan";
  const itemsForInvoice = includePlanItem
    ? [
        {
          name: payload.plan?.name?.trim() || planSlug,
          productId: planProductId,
          priceId: planPriceId,
          currency: "USD",
          amount: planAmount ?? 0,
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
      ].filter((i) => i.priceId)
    : (payload.upgrades ?? [])
        .map((u, idx) => ({
          name: u.name?.trim() || `Upgrade ${idx + 1}`,
          productId: u.ghlProductId?.trim() || undefined,
          priceId: upgradePriceIds[idx],
          currency: "USD",
          amount:
            typeof u.price === "number" && Number.isFinite(u.price) && u.price > 0
              ? Math.round(u.price * 100) / 100
              : 0,
          qty: 1,
        }))
        .filter((i) => i.priceId);

  const ghl = createGhlClient();

  const canCreateInvoice =
    ghl &&
    locationId &&
    (checkoutKind === "plan" ? Boolean(planPriceId && planAmount != null) : itemsForInvoice.length > 0);
  if (canCreateInvoice) {
    try {
      const invoiceRes = await ghl.invoices.text2payInvoice(
        {
          altId: locationId,
          altType: "location",
          name: `${payload.plan?.name || planSlug} checkout`,
          currency: "USD",
          items: itemsForInvoice,
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
        const checkoutUrl = (invoiceRes as { invoiceUrl: string }).invoiceUrl;
        if (checkoutSessionId) {
          await connectDb();
          await PricingCheckoutSession.findOneAndUpdate(
            { sessionId: checkoutSessionId },
            {
              $set: {
                purchaserEmail: email,
                planId: planSlug,
                ...(checkoutKind === "plan"
                  ? { planCheckoutUrl: checkoutUrl }
                  : {
                      upgradesCheckoutUrl: checkoutUrl,
                      selectedUpgradeSlugs: (payload.upgrades ?? [])
                        .map((u) => u.slug?.trim())
                        .filter((v): v is string => Boolean(v)),
                    }),
              },
            },
            { upsert: true, new: true },
          );
        }
        return NextResponse.json({
          ok: true,
          checkoutUrl,
          mode: "invoice",
          checkoutKind,
          checkoutSessionId: checkoutSessionId || null,
          warning: contactUpsertWarning,
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
  if (checkoutSessionId) {
    await connectDb();
    await PricingCheckoutSession.findOneAndUpdate(
      { sessionId: checkoutSessionId },
      {
        $set: {
          purchaserEmail: email,
          planId: planSlug,
          ...(checkoutKind === "plan"
            ? { planCheckoutUrl: url.toString() }
            : {
                upgradesCheckoutUrl: url.toString(),
                selectedUpgradeSlugs: (payload.upgrades ?? [])
                  .map((u) => u.slug?.trim())
                  .filter((v): v is string => Boolean(v)),
              }),
        },
      },
      { upsert: true, new: true },
    );
  }

  return NextResponse.json({
    ok: true,
    checkoutUrl: url.toString(),
    mode: "legacy-url",
    checkoutKind,
    checkoutSessionId: checkoutSessionId || null,
    warning: [
      !planPriceId
        ? `No mapped plan price id for '${planSlug}'. Set GHL_PLAN_PRICE_IDS or ensure GHL plan products have prices.`
        : undefined,
      contactUpsertWarning,
    ]
      .filter(Boolean)
      .join(" | "),
  });
}

