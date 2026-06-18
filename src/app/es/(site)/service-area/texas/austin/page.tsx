import { redirect } from "next/navigation";
import {
  MetroRegionalLandingPage,
  metroRegionalMetadata,
} from "@/components/service-area/metro-regional-landing-page";
import { buildCountyRedirectFromGeoLoc } from "@/lib/geo-landing-redirect";

export const metadata = metroRegionalMetadata("austin", "es");

type SearchParams = Record<string, string | string[] | undefined>;

function searchParamsToQuery(sp: SearchParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export default async function EsAustinRegionalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const loc = typeof sp.loc === "string" ? sp.loc : undefined;
  if (loc) {
    const target = buildCountyRedirectFromGeoLoc(loc, "es", searchParamsToQuery(sp));
    if (target) redirect(target);
  }

  return <MetroRegionalLandingPage metroId="austin" locale="es" />;
}
