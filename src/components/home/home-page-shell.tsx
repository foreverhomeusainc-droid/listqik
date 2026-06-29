import type { Listing } from "@/data/types";
import { HomePageContent } from "@/components/home/home-page-content";

export function HomePageShell({ featuredListings }: { featuredListings: Listing[] }) {
  return <HomePageContent featuredListings={featuredListings} />;
}
