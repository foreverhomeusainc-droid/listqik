/**
 * Builds src/data/google-geo-target-map.json from Google's Geo Targets CSV.
 *
 * Usage:
 *   node scripts/build-google-geo-map.mjs [path-to-geotargets.csv]
 */
import { createReadStream, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const texasLocations = JSON.parse(
  readFileSync(join(root, "src/data/texas-locations.json"), "utf8"),
);

const GEO_ZIP_URL =
  "https://developers.google.com/static/google-ads/api/data/geo/geotargets-2026-05-28.csv.zip";

const DFW_SATELLITE_COUNTY_SLUGS = [
  "ellis-county",
  "johnson-county",
  "kaufman-county",
  "grayson-county",
  "rockwall-county",
  "hunt-county",
  "henderson-county",
  "wise-county",
  "hood-county",
  "navarro-county",
  "cherokee-county",
  "fannin-county",
];

const AUSTIN_SATELLITE_COUNTY_SLUGS = [
  "bastrop-county",
  "caldwell-county",
  "burnet-county",
  "blanco-county",
  "lee-county",
  "fayette-county",
  "llano-county",
  "gillespie-county",
  "lampasas-county",
  "milam-county",
];

const SAN_ANTONIO_SATELLITE_COUNTY_SLUGS = [
  "comal-county",
  "kendall-county",
  "guadalupe-county",
  "wilson-county",
  "medina-county",
  "bandera-county",
  "atascosa-county",
];

function buildSatelliteCriteriaIds(byCriteriaId, slugs) {
  const ids = {};
  for (const slug of slugs) {
    const entry = Object.entries(byCriteriaId).find(
      ([, v]) => v.countySlug === slug && v.targetType === "County",
    );
    if (entry) ids[entry[0]] = slug;
  }
  return ids;
}

function buildCityToCountyLookup() {
  const lookup = new Map();
  for (const county of texasLocations.locations) {
    for (const city of county.cities) {
      const key = city.name.toLowerCase().replace(/\s+/g, " ").trim();
      lookup.set(key, {
        countyName: county.county,
        countySlug: county.countySlug,
      });
    }
  }
  return lookup;
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

function findCsvInDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findCsvInDir(full);
      if (found) return found;
    } else if (entry.name.endsWith("geotargets") || entry.name.endsWith(".csv")) {
      if (entry.name.includes("geotarget")) return full;
    }
  }
  return null;
}

async function resolveCsvPath(inputPath) {
  if (inputPath) return inputPath;

  const cached = join(root, ".tmp", "geotargets2");
  const existing = findCsvInDir(cached);
  if (existing) {
    console.log(`Using cached CSV: ${existing}`);
    return existing;
  }

  const tmpDir = join(root, ".tmp", "geo-build");
  mkdirSync(tmpDir, { recursive: true });
  const zipPath = join(tmpDir, "geotargets.zip");

  console.log("Downloading geo targets CSV…");
  const res = await fetch(GEO_ZIP_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));

  const { execFileSync } = await import("node:child_process");
  const extractDir = join(tmpDir, "extracted");
  mkdirSync(extractDir, { recursive: true });
  execFileSync("tar", ["-xf", zipPath, "-C", extractDir], { stdio: "inherit" });

  const csv = findCsvInDir(extractDir);
  if (!csv) throw new Error("CSV not found in zip — pass path manually");
  return csv;
}

async function main() {
  const csvPath = await resolveCsvPath(process.argv[2]);
  const cityLookup = buildCityToCountyLookup();
  const texasCountyByName = new Map(
    texasLocations.locations.map((c) => [c.county.toLowerCase(), c]),
  );

  const byCriteriaId = {};
  let texasCountyCount = 0;
  let texasCityCount = 0;
  let skippedCity = 0;

  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }
    const [criteriaId, name, canonicalName, , countryCode, targetType, status] = parseCsvLine(line);
    if (!criteriaId || countryCode !== "US" || status !== "Active") continue;
    if (!canonicalName.includes(",Texas,United States")) continue;

    if (targetType === "County" && canonicalName.endsWith(",Texas,United States")) {
      const countyName = name.replace(/\s+County$/i, "").trim();
      const county = texasCountyByName.get(countyName.toLowerCase());
      if (!county) continue;
      byCriteriaId[criteriaId] = {
        countySlug: county.countySlug,
        countyName: county.county,
        targetType: "County",
        googleName: name,
      };
      texasCountyCount++;
      continue;
    }

    if (targetType === "City") {
      const countyFromCanonical = canonicalName.match(/^([^,]+),([^,]+) County,Texas,United States$/);
      let countySlug;
      let countyName;

      if (countyFromCanonical) {
        const cName = countyFromCanonical[2];
        const county = texasCountyByName.get(cName.toLowerCase());
        if (county) {
          countySlug = county.countySlug;
          countyName = county.county;
        }
      } else {
        const cityKey = name.toLowerCase().replace(/\s+/g, " ").trim();
        const match = cityLookup.get(cityKey);
        if (match) {
          countySlug = match.countySlug;
          countyName = match.countyName;
        }
      }

      if (!countySlug) {
        skippedCity++;
        continue;
      }

      byCriteriaId[criteriaId] = {
        countySlug,
        countyName,
        targetType: "City",
        googleName: name,
      };
      texasCityCount++;
    }
  }

  const dfwSatelliteCountyCriteriaIds = buildSatelliteCriteriaIds(
    byCriteriaId,
    DFW_SATELLITE_COUNTY_SLUGS,
  );
  const austinSatelliteCountyCriteriaIds = buildSatelliteCriteriaIds(
    byCriteriaId,
    AUSTIN_SATELLITE_COUNTY_SLUGS,
  );
  const sanAntonioSatelliteCountyCriteriaIds = buildSatelliteCriteriaIds(
    byCriteriaId,
    SAN_ANTONIO_SATELLITE_COUNTY_SLUGS,
  );

  const metroSatelliteCountyCriteriaIds = {
    dfw: dfwSatelliteCountyCriteriaIds,
    austin: austinSatelliteCountyCriteriaIds,
    "san-antonio": sanAntonioSatelliteCountyCriteriaIds,
  };

  const satelliteCountyCriteriaIds = dfwSatelliteCountyCriteriaIds;

  const output = {
    generatedAt: new Date().toISOString(),
    sourceCsv: csvPath.replace(root, "").replace(/\\/g, "/") || csvPath,
    stats: {
      texasCountyMappings: texasCountyCount,
      texasCityMappings: texasCityCount,
      skippedCities: skippedCity,
      totalCriteriaIds: Object.keys(byCriteriaId).length,
    },
    dfwSatelliteCountySlugs: DFW_SATELLITE_COUNTY_SLUGS,
    austinSatelliteCountySlugs: AUSTIN_SATELLITE_COUNTY_SLUGS,
    sanAntonioSatelliteCountySlugs: SAN_ANTONIO_SATELLITE_COUNTY_SLUGS,
    satelliteCountyCriteriaIds,
    metroSatelliteCountyCriteriaIds,
    byCriteriaId,
  };

  const outPath = join(root, "src/data/google-geo-target-map.json");
  writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outPath}`);
  console.log(
    `  ${texasCountyCount} TX counties, ${texasCityCount} TX cities, ${Object.keys(byCriteriaId).length} total IDs`,
  );
  console.log(`  DFW satellite county IDs: ${Object.keys(dfwSatelliteCountyCriteriaIds).length}/12`);
  console.log(`  Austin satellite county IDs: ${Object.keys(austinSatelliteCountyCriteriaIds).length}/10`);
  console.log(
    `  San Antonio satellite county IDs: ${Object.keys(sanAntonioSatelliteCountyCriteriaIds).length}/7`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
