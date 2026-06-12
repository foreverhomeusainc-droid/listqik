/**
 * Prints Google Ads setup for the DFW Satellite regional campaign (one MLS ad group).
 * Run: npm run ads:dfw-satellite-setup
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const geoMap = JSON.parse(readFileSync(join(root, "src/data/google-geo-target-map.json"), "utf8"));

const ORIGIN = "https://listqik.com";
const LANDING = "/service-area/texas/dfw";

const KEYWORDS = [
  "flat fee mls texas",
  "texas flat fee mls",
  "ntreis flat fee listing",
  "flat fee mls listing",
  "$79 mls listing",
  "texas flat fee broker",
  "discount real estate broker texas",
  "best flat fee mls listing",
];

const HEADLINES = [
  "Texas Flat Fee MLS",
  "NTREIS MLS Listing For $79",
  "Flat Fee MLS Listing",
  "List On Texas MLS Today",
  "NTREIS MLS Access",
  "Get Listed On MLS Fast",
  "Texas MLS From Just $79",
  "$79 MLS Listing Texas",
  "No Hidden Listing Fees",
  "List Your Home On MLS",
  "Texas Flat Fee Listing",
  "Full MLS Exposure",
  "Fast Texas MLS Listing",
  "Broker-Backed NTREIS MLS",
];

const DESCRIPTIONS = [
  "List your Texas home on the MLS for just $79. Transparent pricing.",
  "Get NTREIS MLS exposure with our affordable flat fee listing.",
  "Fast, transparent Texas MLS listings designed for homeowners.",
  "Start your Texas MLS listing today and get maximum exposure.",
];

const NEGATIVES = [
  "houston",
  "harris county",
  "har",
  "san antonio",
  "austin",
  "rent",
  "rental",
  "apartment",
  "jobs",
  "salary",
  "license",
  "course",
  "training",
  "free mls",
  "craigslist",
  "homes for sale",
  "zillow homes",
];

const finalUrl = `${ORIGIN}${LANDING}?loc={loc_physical_ms}&utm_source=google&utm_medium=cpc&utm_campaign=dfw-satellite-en`;

console.log("═".repeat(72));
console.log("DFW SATELLITE — GOOGLE ADS SETUP (1 regional MLS ad group)");
console.log("═".repeat(72));
console.log();
console.log("PRE-LAUNCH CHECKLIST");
console.log("  1. Ads → confirm RSA status is Approved (not Disapproved / Limited)");
console.log("  2. Keywords → remove or pause any with Low search volume");
console.log("  3. Location → Presence only; match the 12 counties listed below");
console.log("  4. Landing page → /service-area/texas/dfw shows brokerage address");
console.log("  5. Brokerage office: 508 N 2nd St, Honey Grove, TX 75446");
console.log();
console.log("CAMPAIGN");
console.log("  Name:     DFW Satellite Counties English");
console.log("  Type:     Search");
console.log("  Bidding:  Manual CPC or Maximize clicks with max CPC cap ($2–4)");
console.log("  Budget:   $15–25/day (low-volume counties)");
console.log("  Geo:      Presence only — target these 12 counties:");
for (const slug of geoMap.dfwSatelliteCountySlugs) {
  const name = slug.replace(/-county$/, "").replace(/-/g, " ");
  const title = name.replace(/\b\w/g, (c) => c.toUpperCase());
  console.log(`            - ${title} County`);
}
console.log();
console.log("AD GROUP (single)");
console.log("  Name:     MLS — flat fee NTREIS");
console.log("  Final URL:");
console.log(`    ${finalUrl}`);
console.log();
console.log("  Match types: Phrase and Exact only (not Broad match)");
console.log();
console.log("  Keywords:");
for (const kw of KEYWORDS) {
  console.log(`    [${kw}]`);
}
console.log();
console.log("  Headlines (regional — no county names):");
for (const h of HEADLINES) {
  console.log(`    - ${h}`);
}
console.log();
console.log("  Descriptions:");
for (const d of DESCRIPTIONS) {
  console.log(`    - ${d}`);
}
console.log();
console.log("  Campaign negatives:");
for (const n of NEGATIVES) {
  console.log(`    - ${n}`);
}
console.log();
console.log("VALUETrack / LANDING FLOW");
console.log("  1. User clicks ad with {loc_physical_ms} in URL");
console.log("  2. Lands on /service-area/texas/dfw?loc=<google_geo_id>");
console.log("  3. Site maps geo ID → county slug → redirects to county lander");
console.log("  4. If loc missing/unknown → regional DFW page (fallback)");
console.log();
console.log("  Satellite county Google Criteria IDs (for geo targeting reference):");
for (const [id, slug] of Object.entries(geoMap.satelliteCountyCriteriaIds)) {
  console.log(`    ${id} → ${slug}`);
}
console.log();
console.log("SPANISH CAMPAIGN");
console.log(`  Final URL: ${ORIGIN}/es${LANDING}?loc={loc_physical_ms}&utm_source=google&utm_medium=cpc&utm_campaign=dfw-satellite-es`);
console.log();
