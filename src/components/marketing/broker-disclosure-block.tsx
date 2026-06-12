import Link from "next/link";
import Image from "next/image";
import type { HomeLocale } from "@/i18n/home-locale";
import { getBrokerDisclosureCopy } from "@/i18n/broker-disclosure-copy";
import { BROKER_CONTACT, brokerFullAddressLine } from "@/lib/broker-contact";
import { localeSitePath } from "@/lib/locale-site-path";

type BrokerDisclosureBlockProps = {
  locale: HomeLocale;
  variant?: "compact" | "prominent";
};

export function BrokerDisclosureBlock({ locale, variant = "prominent" }: BrokerDisclosureBlockProps) {
  const copy = getBrokerDisclosureCopy(locale);
  const address = brokerFullAddressLine();
  const isCompact = variant === "compact";

  return (
    <aside
      className={
        isCompact
          ? "rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/75"
          : "rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-6 text-sm text-white/80"
      }
    >
      <p className={isCompact ? "text-[10px] font-semibold tracking-widest text-emerald-300/90" : "text-xs font-semibold tracking-widest text-emerald-300/90"}>
        {copy.eyebrow}
      </p>
      <div className={`mt-3 space-y-1 ${isCompact ? "text-xs" : "text-sm"}`}>
        <p className="font-semibold text-white/90">{BROKER_CONTACT.brandName}</p>
        <p>{copy.sponsoredBy}</p>
        <p className="font-medium text-white/85">{BROKER_CONTACT.sponsoringBroker}</p>
        <p>
          {copy.licenseLabel}:{" "}
          <span className="font-mono text-emerald-100/90">{BROKER_CONTACT.sponsoringBrokerLicense}</span>
        </p>
      </div>

      <address className={`mt-4 not-italic leading-relaxed ${isCompact ? "text-xs" : "text-sm"} text-white/75`}>
        <div>{BROKER_CONTACT.streetAddress}</div>
        <div>
          {BROKER_CONTACT.city}, {BROKER_CONTACT.state} {BROKER_CONTACT.postalCode}
        </div>
        <div className="mt-2">
          <a href={`tel:${BROKER_CONTACT.phoneTel}`} className="text-emerald-300/90 hover:text-white">
            {BROKER_CONTACT.phone}
          </a>
          {" · "}
          <a href={`mailto:${BROKER_CONTACT.email}`} className="text-emerald-300/90 hover:text-white">
            {BROKER_CONTACT.email}
          </a>
        </div>
        <div className="mt-1">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-emerald-300/80 underline underline-offset-2 hover:text-white"
          >
            {copy.mapLink}
          </a>
        </div>
      </address>

      {!isCompact ? (
        <div className="mt-4 flex items-center gap-3">
          <Image
            src="/central-metro-realty-logo.svg"
            alt={BROKER_CONTACT.sponsoringBroker}
            width={160}
            height={40}
            className="h-8 w-auto opacity-90"
          />
        </div>
      ) : null}

      <p className={`mt-4 ${isCompact ? "text-[11px]" : "text-xs"} text-white/55`}>
        <Link
          href={localeSitePath("/resources/legal/iabs", locale)}
          className="text-emerald-300/85 underline underline-offset-2 hover:text-white"
        >
          {copy.iabsLink}
        </Link>
        {" · "}
        <Link
          href={localeSitePath("/resources/legal/consumer-protection-notice", locale)}
          className="text-emerald-300/85 underline underline-offset-2 hover:text-white"
        >
          {copy.consumerProtectionLink}
        </Link>
      </p>
    </aside>
  );
}
