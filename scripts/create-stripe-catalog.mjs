import fs from "fs";
import path from "path";
import Stripe from "stripe";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!key || process.env[key]) continue;
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const PLAN_CATALOG = [
  { slug: "subsonic", name: "Subsonic", amountUsd: 99 },
  { slug: "supersonic", name: "Supersonic", amountUsd: 295 },
  { slug: "hypersonic", name: "Hypersonic", amountUsd: 595 },
];

const UPGRADE_CATALOG = [
  { slug: "premium-photography-spotlight-listing", name: "Premium Photography & Spotlight Listing", amountUsd: 495 },
  { slug: "smart-market-analysis", name: "Smart Market Analysis (SMA)", amountUsd: 195 },
  { slug: "real-time-showing-management", name: "Real-Time Showing Management", amountUsd: 59 },
  { slug: "open-house-directional-signs-set-of-5", name: "Open House Directional Signs (Set of 5)", amountUsd: 49 },
  { slug: "professional-yard-sign", name: "Professional Yard Sign", amountUsd: 49 },
  { slug: "yard-sign-open-house-signs-bundle", name: "Yard Sign + Open House Directional Signs Bundle", amountUsd: 87 },
  { slug: "lockbox", name: "Lockbox", amountUsd: 49 },
  { slug: "upgrade-listing-to-maximum-photos", name: "Upgrade Listing to Maximum Photos", amountUsd: 99 },
  { slug: "add-a-video-owner-provided", name: "Add a Video (Owner Provided)", amountUsd: 40 },
  { slug: "unlimited-open-house-announcements", name: "Unlimited Open House Announcements", amountUsd: 100 },
  { slug: "list-in-an-additional-mls", name: "Additional Listing Territory Coordination", amountUsd: 99 },
  { slug: "personal-transaction-coordinator-service", name: "Personal Transaction Coordinator Service", amountUsd: 395 },
  { slug: "contract-preparation-review", name: "Contract Preparation & Review", amountUsd: 595 },
  { slug: "open-house-announcement", name: "Open House Announcement", amountUsd: 25 },
];

async function ensureProductAndPrice(stripe, row, category) {
  const productSearch = await stripe.products.search({
    query: `active:'true' AND metadata['app_slug']:'${row.slug}' AND metadata['app_category']:'${category}'`,
    limit: 1,
  });

  let product = productSearch.data[0];
  if (!product) {
    product = await stripe.products.create({
      name: row.name,
      active: true,
      metadata: {
        app_slug: row.slug,
        app_category: category,
      },
    });
  }

  const unitAmount = Math.round(row.amountUsd * 100);
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
    type: "one_time",
  });

  let price = prices.data.find((p) => p.currency === "usd" && p.unit_amount === unitAmount) ?? null;
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: unitAmount,
      metadata: {
        app_slug: row.slug,
        app_category: category,
      },
    });
  }

  return { productId: product.id, priceId: price.id };
}

async function main() {
  loadEnvLocal();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment.");
  }

  const stripe = new Stripe(key);
  const planMap = {};
  const upgradeMap = {};

  for (const row of PLAN_CATALOG) {
    const ids = await ensureProductAndPrice(stripe, row, "plan");
    planMap[row.slug] = ids.priceId;
  }

  for (const row of UPGRADE_CATALOG) {
    const ids = await ensureProductAndPrice(stripe, row, "upgrade");
    upgradeMap[row.slug] = ids.priceId;
  }

  console.log("\nSTRIPE_PLAN_PRICE_IDS_JSON=");
  console.log(JSON.stringify(planMap));
  console.log("\nSTRIPE_UPGRADE_PRICE_IDS_JSON=");
  console.log(JSON.stringify(upgradeMap));
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
