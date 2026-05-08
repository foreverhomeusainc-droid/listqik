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

async function main() {
  loadEnvLocal();
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) throw new Error("Missing STRIPE_SECRET_KEY.");

  const stripe = new Stripe(secret);
  const code = "LISTQIK100";

  const existingPromotionCodes = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
  });

  if (existingPromotionCodes.data[0]) {
    console.log(`Promotion code already exists and is active: ${code}`);
    console.log(`promotion_code_id=${existingPromotionCodes.data[0].id}`);
    console.log(`coupon_id=${typeof existingPromotionCodes.data[0].coupon === "string" ? existingPromotionCodes.data[0].coupon : existingPromotionCodes.data[0].coupon.id}`);
    return;
  }

  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: "once",
    name: "LISTQIK100 100% discount",
    metadata: {
      app_code: code,
    },
  });

  let promo;
  try {
    promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      active: true,
      metadata: {
        app_code: code,
      },
    });
  } catch {
    promo = await stripe.promotionCodes.create({
      promotion: {
        type: "coupon",
        coupon: coupon.id,
      },
      code,
      active: true,
      metadata: {
        app_code: code,
      },
    });
  }

  console.log(`Created promotion code: ${code}`);
  console.log(`promotion_code_id=${promo.id}`);
  console.log(`coupon_id=${coupon.id}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
