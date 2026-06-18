"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { ListQikLogo } from "@/components/listqik-logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/social-icons";
import { getSiteShellChromeCopy, SITE_CHROME_LOCALE } from "@/i18n/site-chrome-copy";
import { BROKER_CONTACT, brokerFullAddressLine } from "@/lib/broker-contact";
import { localeSitePath } from "@/lib/locale-site-path";
import {
  getListQikYoutubeChannelUrl,
  LISTQIK_FACEBOOK_MESSENGER_URL,
  LISTQIK_INSTAGRAM_URL,
  LISTQIK_TIKTOK_URL,
} from "@/lib/social-links";

const socialLinkClassName =
  "inline-flex rounded-md p-1 text-white/55 transition hover:bg-white/5 hover:text-white";

export function SiteFooterChrome() {
  const t = getSiteShellChromeCopy().footer;
  const year = new Date().getFullYear();
  const youtubeUrl = getListQikYoutubeChannelUrl(SITE_CHROME_LOCALE);

  return (
    <footer className="border-t border-white/10">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <Link href={localeSitePath("/", SITE_CHROME_LOCALE)} className="inline-block">
              <ListQikLogo variant="footer" />
            </Link>
            <p className="text-sm text-muted">{t.tagline}</p>
            <div className="text-xs text-white/50 font-mono">{t.brokerSupport}</div>
            <div className="flex items-center gap-3 pt-3">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.youtubeAriaLabel}
                className={socialLinkClassName}
              >
                <YoutubeIcon />
              </a>
              <a
                href={LISTQIK_TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.tiktokAriaLabel}
                className={socialLinkClassName}
              >
                <TiktokIcon />
              </a>
              <a
                href={LISTQIK_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.instagramAriaLabel}
                className={socialLinkClassName}
              >
                <InstagramIcon />
              </a>
              <a
                href={LISTQIK_FACEBOOK_MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.messengerAriaLabel}
                className={socialLinkClassName}
              >
                <FacebookIcon />
              </a>
            </div>
            <div className="pt-2 text-xs text-white/60">
              <div className="font-semibold text-white/70">Resolution Realty Group</div>
              <address className="mt-2 not-italic leading-relaxed text-white/55">
                <div>{brokerFullAddressLine()}</div>
                <div className="mt-1">
                  <a href={`tel:${BROKER_CONTACT.phoneTel}`} className="hover:text-white">
                    {BROKER_CONTACT.phone}
                  </a>
                  {" · "}
                  <a href={`mailto:${BROKER_CONTACT.email}`} className="hover:text-white">
                    {BROKER_CONTACT.email}
                  </a>
                </div>
                <div className="mt-1">
                  TREC {BROKER_CONTACT.sponsoringBrokerLicense}
                </div>
              </address>
              <div className="mt-2 flex items-center gap-3">
                <Image
                  src="/central-metro-realty-logo.svg"
                  alt={t.centralMetroAlt}
                  width={160}
                  height={40}
                  className="h-8 w-auto opacity-90"
                  priority={false}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-white/70">{t.product}</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/pricing", SITE_CHROME_LOCALE)}
                  >
                    {t.pricing}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/listings", SITE_CHROME_LOCALE)}
                  >
                    {t.listings}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-white/70">{t.resources}</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/blogs", SITE_CHROME_LOCALE)}
                  >
                    {t.blogs}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/videos", SITE_CHROME_LOCALE)}
                  >
                    {t.videos}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/listqik-university", SITE_CHROME_LOCALE)}
                  >
                    {t.university}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-white/70">{t.legal}</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/iabs", SITE_CHROME_LOCALE)}
                  >
                    {t.iabs}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/consumer-protection-notice", SITE_CHROME_LOCALE)}
                  >
                    {t.consumerProtection}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/mls-rule-schedule-of-fines", SITE_CHROME_LOCALE)}
                  >
                    {t.mlsFines}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/mls-rules-and-regulations", SITE_CHROME_LOCALE)}
                  >
                    {t.mlsRules}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/fair-housing", SITE_CHROME_LOCALE)}
                  >
                    {t.fairHousing}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/privacy", SITE_CHROME_LOCALE)}
                  >
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/terms", SITE_CHROME_LOCALE)}
                  >
                    {t.terms}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} ListQik.com · Resolution Realty Group. {t.copyright}
          </div>
          <div className="font-mono">
            {t.status} <span className="text-white/70">{t.operational}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
