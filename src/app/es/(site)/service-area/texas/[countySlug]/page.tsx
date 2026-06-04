import {
  generateTexasCountyMetadata,
  TexasCountyLocationPage,
} from "@/components/service-area/texas-county-location-page";
import { allCountyStaticParams } from "@/lib/texas-location-seo";

export function generateStaticParams() {
  return allCountyStaticParams();
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  return generateTexasCountyMetadata("es", params);
}

export default function EsTexasCountySeoPage({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  return <TexasCountyLocationPage locale="es" params={params} />;
}
