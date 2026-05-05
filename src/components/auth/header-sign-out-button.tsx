"use client";

import { signOut } from "next-auth/react";

export function HeaderSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/25 px-3 text-sm font-semibold tracking-wide text-emerald-100/90 transition hover:border-emerald-300/50 sm:inline-flex"
    >
      Log out
    </button>
  );
}

