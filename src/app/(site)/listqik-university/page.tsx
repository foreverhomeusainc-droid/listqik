import type { Metadata } from "next";
import { ListqikUniversityPageContent } from "@/components/listqik-university/listqik-university-page-content";
import { fetchListQikYouTubeFeed } from "@/lib/youtube-channel";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ListQik University",
  description:
    "Free video lessons from the List Quick YouTube channel — listing workflow, pricing, MLS prep, and Texas compliance for ListQik sellers.",
  alternates: {
    canonical: "/listqik-university",
  },
};

export default async function ListqikUniversityPage() {
  const feed = await fetchListQikYouTubeFeed();

  return <ListqikUniversityPageContent feed={feed} />;
}
