/**
 * Removes demo/seed buyer deals and static placeholder listing slugs from MongoDB.
 *
 * Usage:
 *   node scripts/remove-seed-listings.mjs --dry-run
 *   node scripts/remove-seed-listings.mjs --confirm
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

/** Former src/data/buyer-deals-seed.json externalIds (demo MLS picks + comp rows). */
const SEED_BUYER_DEAL_EXTERNAL_IDS = [
  "har-75206-88421",
  "ntreis-76107-552901",
  "actris-78745-77102",
  "har-77008-993441",
  "sabor-78209-441201",
  "ntreis-75024-662811",
  "har-75206-comp-01",
  "har-75206-comp-02",
  "ntreis-76107-comp-01",
  "actris-78745-comp-01",
  "har-77008-comp-01",
  "sabor-78209-comp-01",
];

/** Static marketing placeholders from former src/data/listings.ts */
const STATIC_LISTING_SLUGS = [
  "austin-78704-south-lamar-glass-loft",
  "dallas-75205-highland-park-cobalt",
  "houston-77005-west-u-greenline",
  "san-antonio-78209-alamo-heights-panel",
];

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

function resolveCollection(existingNames, suffix) {
  const lower = new Map(existingNames.map((n) => [n.toLowerCase(), n]));
  return lower.get(suffix) ?? null;
}

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const dryRun = process.argv.includes("--dry-run");
  const confirm = process.argv.includes("--confirm");
  if (!dryRun && !confirm) {
    console.error("Pass --dry-run to preview or --confirm to delete.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const existing = (await db.listCollections().toArray()).map((c) => c.name);

  const buyerDealsName = resolveCollection(existing, "mlsbuyerdeals");
  const listingsName = resolveCollection(existing, "listings");

  if (buyerDealsName) {
    const buyerFilter = { externalId: { $in: SEED_BUYER_DEAL_EXTERNAL_IDS } };
    const buyerMatches = await db.collection(buyerDealsName).find(buyerFilter).toArray();
    console.log(`Seed buyer deals to remove: ${buyerMatches.length}`);
    for (const row of buyerMatches) {
      console.log(`  - ${row.externalId} (${row.city}, ${row.zip})`);
    }
    if (!dryRun && buyerMatches.length) {
      const result = await db.collection(buyerDealsName).deleteMany(buyerFilter);
      console.log(`Deleted ${result.deletedCount} buyer deal(s).`);
    }
  } else {
    console.log("No mlsbuyerdeals collection found — skipping buyer deals.");
  }

  if (listingsName) {
    const listingFilter = { slug: { $in: STATIC_LISTING_SLUGS } };
    const listingMatches = await db.collection(listingsName).find(listingFilter).toArray();
    console.log(`\nStatic placeholder listings to remove: ${listingMatches.length}`);
    for (const row of listingMatches) {
      console.log(`  - ${row.slug} (${row.street ?? ""}, ${row.city ?? ""})`);
    }
    if (!dryRun && listingMatches.length) {
      const result = await db.collection(listingsName).deleteMany(listingFilter);
      console.log(`Deleted ${result.deletedCount} listing(s).`);
    }
  } else {
    console.log("\nNo listings collection found — skipping public listings.");
  }

  if (dryRun) {
    console.log("\nDry run only — no data deleted.");
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
