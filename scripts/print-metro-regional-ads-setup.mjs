/**
 * Prints Google Ads setup for a metro regional campaign (DFW, Austin, or San Antonio).
 * Run: npm run ads:austin-setup | ads:san-antonio-setup | ads:metro-regional-setup
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const geoMap = JSON.parse(readFileSync(join(root, "src/data/google-geo-target-map.json"), "utf8"));

const ORIGIN = "https://listqik.com";

const METRO_CONFIG = {
  dfw: {
    label: "DFW Satellite Counties",
    landing: "/service-area/texas/dfw",
    utmCampaignEn: "dfw-satellite-en",
    utmCampaignEs: "dfw-satellite-es",
    mls: "NTREIS",
    slugKey: "dfwSatelliteCountySlugs",
    negatives: ["houston", "harris county", "har", "san antonio", "austin", "actris", "sabor"],
    keywords: [
      "flat fee mls texas",
      "texas flat fee mls",
      "ntreis flat fee listing",
      "flat fee mls listing",
      "$79 mls listing",
      "texas flat fee broker",
      "discount real estate broker texas",
      "best flat fee mls listing",
    ],
    headlines: [
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
    ],
    descriptions: [
      "List your Texas home on the MLS for just $79. Transparent pricing.",
      "Get NTREIS MLS exposure with our affordable flat fee listing.",
      "Fast, transparent Texas MLS listings designed for homeowners.",
      "Start your Texas MLS listing today and get maximum exposure.",
    ],
  },
  austin: {
    label: "Austin Area Counties",
    landing: "/service-area/texas/austin",
    utmCampaignEn: "austin-regional-en",
    utmCampaignEs: "austin-regional-es",
    mls: "ACTRIS",
    slugKey: "austinSatelliteCountySlugs",
    negatives: [
      "houston",
      "harris county",
      "har",
      "san antonio",
      "sabor",
      "dfw",
      "dallas",
      "fort worth",
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
    ],
    keywords: [
      "flat fee mls austin",
      "austin flat fee mls",
      "actris flat fee listing",
      "flat fee mls listing austin",
      "$79 mls listing austin",
      "texas flat fee broker austin",
      "discount real estate broker austin",
      "best flat fee mls austin",
    ],
    headlines: [
      "Austin Flat Fee MLS",
      "ACTRIS MLS Listing For $79",
      "Flat Fee MLS Austin",
      "List On Austin MLS Today",
      "ACTRIS MLS Access",
      "Get Listed On MLS Fast",
      "Austin MLS From Just $79",
      "$79 MLS Listing Austin",
      "No Hidden Listing Fees",
      "List Your Home On MLS",
      "Central Texas Flat Fee",
      "Full MLS Exposure",
      "Fast Austin MLS Listing",
      "Broker-Backed ACTRIS MLS",
    ],
    descriptions: [
      "List your Austin-area home on the MLS for just $79. Transparent pricing.",
      "Get ACTRIS MLS exposure with our affordable flat fee listing.",
      "Fast, transparent Central Texas MLS listings designed for homeowners.",
      "Start your Austin MLS listing today and get maximum exposure.",
    ],
  },
  "san-antonio": {
    label: "San Antonio Area Counties",
    landing: "/service-area/texas/san-antonio",
    utmCampaignEn: "san-antonio-regional-en",
    utmCampaignEs: "san-antonio-regional-es",
    mls: "SABOR",
    slugKey: "sanAntonioSatelliteCountySlugs",
    negatives: [
      "houston",
      "harris county",
      "har",
      "austin",
      "actris",
      "dfw",
      "dallas",
      "fort worth",
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
    ],
    keywords: [
      "flat fee mls san antonio",
      "san antonio flat fee mls",
      "sabor flat fee listing",
      "flat fee mls listing san antonio",
      "$79 mls listing san antonio",
      "texas flat fee broker san antonio",
      "discount real estate broker san antonio",
      "best flat fee mls san antonio",
    ],
    headlines: [
      "San Antonio Flat Fee MLS",
      "SABOR MLS Listing For $79",
      "Flat Fee MLS San Antonio",
      "List On San Antonio MLS Today",
      "SABOR MLS Access",
      "Get Listed On MLS Fast",
      "San Antonio MLS From $79",
      "$79 MLS Listing San Antonio",
      "No Hidden Listing Fees",
      "List Your Home On MLS",
      "South Texas Flat Fee",
      "Full MLS Exposure",
      "Fast San Antonio MLS",
      "Broker-Backed SABOR MLS",
    ],
    descriptions: [
      "List your San Antonio-area home on the MLS for just $79. Transparent pricing.",
      "Get SABOR MLS exposure with our affordable flat fee listing.",
      "Fast, transparent South Texas MLS listings designed for homeowners.",
      "Start your San Antonio MLS listing today and get maximum exposure.",
    ],
  },
};

function printMetroSetup(metroId) {
  const config = METRO_CONFIG[metroId];
  if (!config) {
    console.error(`Unknown metro: ${metroId}. Use dfw, austin, or san-antonio.`);
    process.exit(1);
  }

  const slugs = geoMap[config.slugKey] ?? [];
  const criteriaIds = geoMap.metroSatelliteCountyCriteriaIds?.[metroId] ?? {};
  const finalUrl = `${ORIGIN}${config.landing}?loc={loc_physical_ms}&utm_source=google&utm_medium=cpc&utm_campaign=${config.utmCampaignEn}`;

  console.log("═".repeat(72));
  console.log(`${config.label.toUpperCase()} — GOOGLE ADS SETUP (1 regional MLS ad group)`);
  console.log("═".repeat(72));
  console.log();
  console.log("PRE-LAUNCH CHECKLIST");
  console.log("  1. Ads → confirm RSA status is Approved (not Disapproved / Limited)");
  console.log("  2. Keywords → remove or pause any with Low search volume");
  console.log(`  3. Location → Presence only; match the ${slugs.length} counties listed below`);
  console.log(`  4. Landing page → ${config.landing} shows brokerage address`);
  console.log("  5. Brokerage office: 508 N 2nd St, Honey Grove, TX 75446");
  console.log();
  console.log("CAMPAIGN");
  console.log(`  Name:     ${config.label} English`);
  console.log("  Type:     Search");
  console.log("  Bidding:  Manual CPC or Maximize clicks with max CPC cap ($2–4)");
  console.log("  Budget:   $15–25/day (low-volume counties)");
  console.log(`  Geo:      Presence only — target these ${slugs.length} counties:`);
  for (const slug of slugs) {
    const name = slug.replace(/-county$/, "").replace(/-/g, " ");
    const title = name.replace(/\b\w/g, (c) => c.toUpperCase());
    console.log(`            - ${title} County`);
  }
  console.log();
  console.log("AD GROUP (single)");
  console.log(`  Name:     MLS — flat fee ${config.mls}`);
  console.log("  Final URL:");
  console.log(`    ${finalUrl}`);
  console.log();
  console.log("  Match types: Phrase and Exact only (not Broad match)");
  console.log();
  console.log("  Keywords:");
  for (const kw of config.keywords) {
    console.log(`    [${kw}]`);
  }
  console.log();
  console.log("  Headlines (regional — no county names):");
  for (const h of config.headlines) {
    console.log(`    - ${h}`);
  }
  console.log();
  console.log("  Descriptions:");
  for (const d of config.descriptions) {
    console.log(`    - ${d}`);
  }
  console.log();
  console.log("  Campaign negatives:");
  for (const n of config.negatives) {
    console.log(`    - ${n}`);
  }
  console.log();
  console.log("VALUETrack / LANDING FLOW");
  console.log("  1. User clicks ad with {loc_physical_ms} in URL");
  console.log(`  2. Lands on ${config.landing}?loc=<google_geo_id>`);
  console.log("  3. Site maps geo ID → county slug → redirects to county lander");
  console.log("  4. If loc missing/unknown → regional page (fallback)");
  console.log();
  console.log("  Satellite county Google Criteria IDs (for geo targeting reference):");
  for (const [id, slug] of Object.entries(criteriaIds)) {
    console.log(`    ${id} → ${slug}`);
  }
  console.log();
  console.log("SPANISH CAMPAIGN");
  console.log(
    `  Final URL: ${ORIGIN}/es${config.landing}?loc={loc_physical_ms}&utm_source=google&utm_medium=cpc&utm_campaign=${config.utmCampaignEs}`,
  );
  console.log();
}

const metroArg = process.argv[2] ?? "all";
if (metroArg === "all") {
  for (const id of ["dfw", "austin", "san-antonio"]) {
    printMetroSetup(id);
  }
} else {
  printMetroSetup(metroArg);
}
