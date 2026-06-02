"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeSitePath } from "@/lib/locale-site-path";
import type { HomeLocale } from "@/i18n/home-locale";

function isServicesPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const paths = [
    "/full-service",
    "/service-area",
    "/es/full-service",
    "/es/service-area",
  ];
  return paths.some((base) => pathname === base || pathname.startsWith(`${base}/`));
}

type NavServicesDropdownProps = {
  locale: HomeLocale;
  label: string;
  fullServiceLabel: string;
  serviceAreaLabel: string;
};

export function NavServicesDropdown({
  locale,
  label,
  fullServiceLabel,
  serviceAreaLabel,
}: NavServicesDropdownProps) {
  const pathname = usePathname();
  const active = isServicesPath(pathname);
  const fullServiceHref = localeSitePath("/full-service", locale);
  const serviceAreaHref = localeSitePath("/service-area", locale);

  const triggerClass = [
    "inline-flex items-center gap-1 rounded-full border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition",
    active
      ? "border-emerald-300/70 bg-emerald-400/20 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
      : "border-transparent text-emerald-100/85 hover:border-emerald-400/35 hover:bg-emerald-900/25 hover:text-emerald-100",
  ].join(" ");

  return (
    <div className="group relative">
      <button
        type="button"
        className={triggerClass}
        aria-expanded="false"
        aria-haspopup="true"
      >
        {label}
        <span aria-hidden className="text-[10px] opacity-70">
          ▾
        </span>
      </button>

      <div
        className="invisible absolute left-0 top-full z-50 min-w-[12.5rem] pt-1 opacity-0 transition-[visibility,opacity] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        role="menu"
      >
        <div className="overflow-hidden rounded-xl border border-emerald-400/35 bg-black/95 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <Link
            href={fullServiceHref}
            role="menuitem"
            className={[
              "block px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-emerald-900/40 hover:text-emerald-50",
              pathname === fullServiceHref || pathname?.startsWith(`${fullServiceHref}/`)
                ? "bg-emerald-400/15 text-emerald-100"
                : "text-emerald-100/90",
            ].join(" ")}
          >
            {fullServiceLabel}
          </Link>
          <Link
            href={serviceAreaHref}
            role="menuitem"
            className={[
              "block px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-emerald-900/40 hover:text-emerald-50",
              pathname === serviceAreaHref || pathname?.startsWith(`${serviceAreaHref}/`)
                ? "bg-emerald-400/15 text-emerald-100"
                : "text-emerald-100/90",
            ].join(" ")}
          >
            {serviceAreaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
