import { NextResponse } from "next/server";

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
  if (!checkoutBase) {
    return NextResponse.json({
      ok: true,
      checkoutUrl: null,
      warning: "Set GHL_STORE_CHECKOUT_BASE_URL to enable checkout redirect.",
    });
  }

  const upgradeIds = (payload.upgrades ?? [])
    .map((u) => u.ghlProductId)
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  const planProductIds = parsePlanProductIds(process.env.GHL_PLAN_PRODUCT_IDS);
  const planProductId = planProductIds[planSlug];

  const url = new URL(checkoutBase);
  url.searchParams.set("plan", planSlug);
  url.searchParams.set("name", name);
  url.searchParams.set("email", email);
  url.searchParams.set("phone", phone);
  url.searchParams.set("address", address);
  url.searchParams.set("propertyType", propertyType);
  const products = [...new Set([planProductId, ...upgradeIds].filter(Boolean))];
  if (products.length > 0) {
    url.searchParams.set("products", products.join(","));
  }

  return NextResponse.json({
    ok: true,
    checkoutUrl: url.toString(),
    warning:
      !planProductId && Object.keys(planProductIds).length > 0
        ? `No mapped GHL plan product for '${planSlug}' in GHL_PLAN_PRODUCT_IDS.`
        : undefined,
  });
}

