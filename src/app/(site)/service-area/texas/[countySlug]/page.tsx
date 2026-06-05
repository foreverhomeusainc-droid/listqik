import {
  generateTexasCountyMetadata,
  TexasCountyLocationPage,
} from "@/components/service-area/county-service-area-page";
import { allCountyStaticParams } from "@/lib/texas-location-seo";

export function generateStaticParams() {
  return allCountyStaticParams();
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  return generateTexasCountyMetadata("en", params);
}

export default function TexasCountySeoPage({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  return <TexasCountyLocationPage locale="en" params={params} />;
}
