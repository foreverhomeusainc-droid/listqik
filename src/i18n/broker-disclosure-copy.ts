import type { HomeLocale } from "@/i18n/home-locale";

export type BrokerDisclosureCopy = {
  eyebrow: string;
  sponsoredBy: string;
  licenseLabel: string;
  mapLink: string;
  iabsLink: string;
  consumerProtectionLink: string;
};

const COPY: Record<HomeLocale, BrokerDisclosureCopy> = {
  en: {
    eyebrow: "Licensed Texas brokerage",
    sponsoredBy: "Sponsored by",
    licenseLabel: "TREC license",
    mapLink: "View office on map",
    iabsLink: "Information About Brokerage Services (IABS)",
    consumerProtectionLink: "Consumer Protection Notice",
  },
  es: {
    eyebrow: "Correduría con licencia en Texas",
    sponsoredBy: "Patrocinado por",
    licenseLabel: "Licencia TREC",
    mapLink: "Ver oficina en el mapa",
    iabsLink: "Información sobre servicios de correduría (IABS)",
    consumerProtectionLink: "Aviso de protección al consumidor",
  },
};

export function getBrokerDisclosureCopy(locale: HomeLocale): BrokerDisclosureCopy {
  return COPY[locale];
}
