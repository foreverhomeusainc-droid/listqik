"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripEsSitePrefix } from "@/lib/locale-site-path";

export function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = stripEsSitePrefix(usePathname() ?? "");
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition",
        active
          ? "border-emerald-300/70 bg-emerald-400/20 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
          : "border-transparent text-emerald-100/85 hover:border-emerald-400/35 hover:bg-emerald-900/25 hover:text-emerald-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

