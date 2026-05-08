import Link from "next/link";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/admin");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  const links = [
    { href: "/dashboard/admin/listings", label: "Listings" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/25 bg-black/40 p-4">
        <h2 className="text-lg font-semibold text-emerald-100">Admin Console</h2>
        <p className="mt-1 text-sm text-emerald-100/70">
          Manage listings, users, plans, upgrades, and account visibility.
        </p>
        <nav className="mt-3 flex flex-wrap gap-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-emerald-400/35 bg-emerald-950/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-300/65 hover:bg-emerald-900/35"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
