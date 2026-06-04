import { TexasLocationIndexPage, texasIndexMetadata } from "@/components/service-area/texas-location-index-page";

export const metadata = texasIndexMetadata("es");

export default function EsTexasServiceAreaIndexPage() {
  return <TexasLocationIndexPage locale="es" />;
}
