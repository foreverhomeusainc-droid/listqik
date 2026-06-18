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

/** Houston area counties (HAR) — excludes core Harris County. */
export const HOUSTON_SATELLITE_COUNTY_NAMES = [
  "Fort Bend",
  "Montgomery",
  "Brazoria",
  "Galveston",
  "Liberty",
  "Waller",
  "Chambers",
  "Austin",
  "Walker",
  "San Jacinto",
  "Wharton",
  "Colorado",
  "Matagorda",
  "Grimes",
  "Washington",
] as const;

export const ACTRIS_CORE_COUNTY_NAMES = ["Travis", "Williamson", "Hays"] as const;
export const ACTRIS_EXTENDED_COUNTY_NAMES = [...AUSTIN_SATELLITE_COUNTY_NAMES] as const;

export const SABOR_CORE_COUNTY_NAMES = ["Bexar"] as const;
export const SABOR_EXTENDED_COUNTY_NAMES = [...SAN_ANTONIO_SATELLITE_COUNTY_NAMES] as const;

export const HAR_CORE_COUNTY_NAMES = ["Harris"] as const;
export const HAR_EXTENDED_COUNTY_NAMES = [...HOUSTON_SATELLITE_COUNTY_NAMES] as const;

export function countyNamesToSlugs(names: readonly string[]): readonly string[] {
  return names.map((name) => `${name.toLowerCase().replace(/\s+/g, "-")}-county`);
}
