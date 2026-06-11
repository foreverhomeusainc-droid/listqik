import { notFound, redirect } from "next/navigation";
import {
  generateTexasCountyMetadata,
  TexasCountyLocationPage,
} from "@/components/service-area/county-service-area-page";
import {
  buildCountyRedirectFromGeoLoc,
  isGoogleGeoCriteriaPathSegment,
} from "@/lib/geo-landing-redirect";
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

type SearchParams = Record<string, string | string[] | undefined>;

function searchParamsToQuery(sp: SearchParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export default async function EsTexasCountySeoPage({
  params,
  searchParams,
}: {
  params: Promise<{ countySlug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { countySlug } = await params;
  if (isGoogleGeoCriteriaPathSegment(countySlug)) {
    const sp = await searchParams;
    const target = buildCountyRedirectFromGeoLoc(
      countySlug,
      "es",
      searchParamsToQuery(sp) || `?loc=${countySlug}`,
    );
    if (target) redirect(target);
    notFound();
  }

  return <TexasCountyLocationPage locale="es" params={params} />;
}
