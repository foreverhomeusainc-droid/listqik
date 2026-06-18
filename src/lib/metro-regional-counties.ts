/** DFW satellite counties (NTREIS) — excludes primary Collin, Dallas, Denton, Tarrant. */
export const AUSTIN_SATELLITE_COUNTY_NAMES = [
  "Bastrop",
  "Caldwell",
  "Burnet",
  "Blanco",
  "Lee",
  "Fayette",
  "Llano",
  "Gillespie",
  "Lampasas",
  "Milam",
] as const;

/** San Antonio area counties (SABOR) — excludes core Bexar County. */
export const SAN_ANTONIO_SATELLITE_COUNTY_NAMES = [
  "Comal",
  "Kendall",
  "Guadalupe",
  "Wilson",
  "Medina",
  "Bandera",
  "Atascosa",
] as const;

export const ACTRIS_CORE_COUNTY_NAMES = ["Travis", "Williamson", "Hays"] as const;
export const ACTRIS_EXTENDED_COUNTY_NAMES = [...AUSTIN_SATELLITE_COUNTY_NAMES] as const;

export const SABOR_CORE_COUNTY_NAMES = ["Bexar"] as const;
export const SABOR_EXTENDED_COUNTY_NAMES = [...SAN_ANTONIO_SATELLITE_COUNTY_NAMES] as const;

export function countyNamesToSlugs(names: readonly string[]): readonly string[] {
  return names.map((name) => `${name.toLowerCase().replace(/\s+/g, "-")}-county`);
}
