import type { Metadata } from "next";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { listings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse Texas home listings on ListQik.com with local broker-backed support from Resolution Realty Group.",
  alternates: {
    canonical: "/listings",
  },
};

export default function ListingsPage() {
  return <ListingsPageContent listings={listings} />;
}
