import type { Listing } from "./types";

/** Live listings come from MongoDB — no static placeholders. */
export const listings: Listing[] = [];

export const listingCities = ["Austin", "Dallas", "Houston", "San Antonio"] as const;
export type ListingCity = (typeof listingCities)[number];
