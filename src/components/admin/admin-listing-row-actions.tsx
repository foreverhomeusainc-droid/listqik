"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminListingRowActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!window.confirm("Delete this admin listing permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        window.alert(data.error ?? "Could not delete listing.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Link
        href={`/dashboard/admin/listings/${listingId}/edit`}
        className="text-xs font-semibold text-emerald-300 underline"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={() => void onDelete()}
        className="text-xs font-semibold text-rose-300 underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
