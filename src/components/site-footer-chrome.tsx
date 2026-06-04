"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { ListQikLogo } from "@/components/listqik-logo";
import { useSiteLocale } from "@/components/site-locale-provider";
import { localeSitePath } from "@/lib/locale-site-path";

export function SiteFooterChrome() {
  const { locale, chrome, ready } = useSiteLocale();
  const t = chrome.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <Link href={localeSitePath("/", locale)} className="inline-block">
              <ListQikLogo variant="footer" />
            </Link>
            <p className="text-sm text-muted">
              {ready
                ? t.tagline
                : "A technical utility for deploying listings fast while retaining more equity."}
            </p>
            <div className="text-xs text-white/50 font-mono">
              {ready
                ? t.brokerSupport
                : "Local Texas broker support · 4-hour rapid deployment"}
            </div>
            <div className="pt-2 text-xs text-white/60">
              <div className="font-semibold text-white/70">
                Resolution Realty Group
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Image
                  src="/central-metro-realty-logo.svg"
                  alt={ready ? t.centralMetroAlt : "Central Metro Realty"}
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
              <div className="text-xs font-semibold tracking-widest text-white/70">
                {ready ? t.product : "Product"}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/pricing", locale)}
                  >
                    {ready ? t.pricing : "Pricing"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/listings", locale)}
                  >
                    {ready ? t.listings : "Listings"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-white/70">
                {ready ? t.resources : "Resources"}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/blogs", locale)}
                  >
                    {ready ? t.blogs : "Blogs"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/videos", locale)}
                  >
                    {ready ? t.videos : "Videos"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/listqik-university", locale)}
                  >
                    {ready ? t.university : "ListQik University"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-white/70">
                {ready ? t.legal : "Legal"}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/iabs", locale)}
                  >
                    {ready ? t.iabs : "Information About Brokerage Services (IABS)"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/consumer-protection-notice", locale)}
                  >
                    {ready ? t.consumerProtection : "Consumer Protection Notice"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/mls-rule-schedule-of-fines", locale)}
                  >
                    {ready ? t.mlsFines : "MLS Rule Schedule of Fines"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/mls-rules-and-regulations", locale)}
                  >
                    {ready ? t.mlsRules : "MLS Rules and Regulations"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/fair-housing", locale)}
                  >
                    {ready ? t.fairHousing : "Fair Housing"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/privacy", locale)}
                  >
                    {ready ? t.privacy : "Privacy"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/70 hover:text-white"
                    href={localeSitePath("/resources/legal/terms", locale)}
                  >
                    {ready ? t.terms : "Terms"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} ListQik.com · Resolution Realty Group.{" "}
            {ready ? t.copyright : "All rights reserved."}
          </div>
          <div className="font-mono">
            {ready ? t.status : "Status:"}{" "}
            <span className="text-white/70">
              {ready ? t.operational : "Operational"}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
