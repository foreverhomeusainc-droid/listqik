/**
 * Backfill locale on legacy blog posts and fix indexes for slug+locale uniqueness.
 *
 *   node scripts/migrate-blog-posts.mjs --dry-run
 *   node scripts/migrate-blog-posts.mjs --confirm
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const root = path.resolve(import.meta.dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* no .env.local */
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

const dryRun = process.argv.includes("--dry-run");
const confirm = process.argv.includes("--confirm");
if (!dryRun && !confirm) {
  console.error("Pass --dry-run or --confirm");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;

const collections = await db.listCollections().toArray();
const blogName =
  collections.find((c) => c.name.toLowerCase() === "blogposts")?.name ??
  collections.find((c) => c.name.toLowerCase().includes("blogpost"))?.name;

if (!blogName) {
  console.log("No blogposts collection found — nothing to migrate.");
  await mongoose.disconnect();
  process.exit(0);
}

const col = db.collection(blogName);

const missingLocale = await col.countDocuments({
  $or: [{ locale: { $exists: false } }, { locale: null }, { locale: "" }],
});
console.log(`Posts missing locale: ${missingLocale}`);

const indexes = await col.indexes();
console.log("\nCurrent indexes:");
for (const idx of indexes) {
  console.log(`  ${idx.name}: ${JSON.stringify(idx.key)} unique=${Boolean(idx.unique)}`);
}

const slugOnlyUnique = indexes.find(
  (idx) =>
    idx.unique &&
    idx.key &&
    Object.keys(idx.key).length === 1 &&
    idx.key.slug === 1,
);

if (dryRun) {
  if (missingLocale > 0) {
    console.log(`\nWould set locale="en" on ${missingLocale} document(s).`);
  }
  if (slugOnlyUnique) {
    console.log(`\nWould drop legacy unique index: ${slugOnlyUnique.name}`);
    console.log('Would ensure compound unique index on { slug: 1, locale: 1 }');
  }
  await mongoose.disconnect();
  process.exit(0);
}

if (missingLocale > 0) {
  const result = await col.updateMany(
    { $or: [{ locale: { $exists: false } }, { locale: null }, { locale: "" }] },
    { $set: { locale: "en" } },
  );
  console.log(`Backfilled locale=en on ${result.modifiedCount} document(s).`);
}

if (slugOnlyUnique && slugOnlyUnique.name !== "_id_") {
  try {
    await col.dropIndex(slugOnlyUnique.name);
    console.log(`Dropped legacy index: ${slugOnlyUnique.name}`);
  } catch (err) {
    console.warn(`Could not drop ${slugOnlyUnique.name}:`, err.message);
  }
}

try {
  await col.createIndex({ slug: 1, locale: 1 }, { unique: true });
  console.log("Ensured compound unique index slug_1_locale_1");
} catch (err) {
  if (err.code === 85 || err.codeName === "IndexOptionsConflict") {
    console.log("Compound slug+locale index already exists.");
  } else {
    throw err;
  }
}

await mongoose.disconnect();
console.log("\nDone.");
