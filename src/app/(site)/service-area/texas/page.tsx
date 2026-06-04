import { TexasLocationIndexPage, texasIndexMetadata } from "@/components/service-area/texas-location-index-page";

export const metadata = texasIndexMetadata("en");

export default function TexasServiceAreaIndexPage() {
  return <TexasLocationIndexPage locale="en" />;
}
