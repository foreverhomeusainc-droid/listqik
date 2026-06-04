import {
  generateTexasCityMetadata,
  TexasCityLocationPage,
} from "@/components/service-area/texas-city-location-page";
import { allCityStaticParams } from "@/lib/texas-location-seo";

export function generateStaticParams() {
  return allCityStaticParams();
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ countySlug: string; citySlug: string }>;
}) {
  return generateTexasCityMetadata("es", params);
}

export default function EsTexasCitySeoPage({
  params,
}: {
  params: Promise<{ countySlug: string; citySlug: string }>;
}) {
  return <TexasCityLocationPage locale="es" params={params} />;
}
