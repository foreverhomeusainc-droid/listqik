"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalculatorAccess } from "@/lib/calculators/access";
import type { CalculatorId } from "@/lib/calculators/types";

export function useCalculatorAccess(calculatorSlug: string) {
  const [access, setAccess] = useState<CalculatorAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calculators/access?tool=${encodeURIComponent(calculatorSlug)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { ok?: boolean; access?: CalculatorAccess };
      if (data.access) setAccess(data.access);
    } finally {
      setLoading(false);
    }
  }, [calculatorSlug]);

  const recordRun = useCallback(async (): Promise<boolean> => {
    const res = await fetch(`/api/calculators/access?tool=${encodeURIComponent(calculatorSlug)}`, {
      method: "POST",
    });
    const data = (await res.json()) as { ok?: boolean; access?: CalculatorAccess };
    if (data.access) setAccess(data.access);
    if (!res.ok) {
      setBlocked(true);
      return false;
    }
    return true;
  }, [calculatorSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { access, loading, blocked, refresh, recordRun };
}

export type PushListingPayload = {
  calculatorSlug: string;
  listingKind?: "sale" | "rental";
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: number;
  propertyType?: string;
  payload?: Record<string, unknown>;
};

export async function pushDealToListing(body: PushListingPayload): Promise<
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string; loginUrl?: string }
> {
  const res = await fetch("/api/calculators/push-listing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    redirectUrl?: string;
    error?: string;
    loginUrl?: string;
  };
  if (!res.ok || !data.ok || !data.redirectUrl) {
    return { ok: false, error: data.error ?? "Could not create listing draft.", loginUrl: data.loginUrl };
  }
  return { ok: true, redirectUrl: data.redirectUrl };
}

export async function exportDealMemoPdf(input: {
  calculatorSlug: string;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/calculators/deal-memo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "PDF export failed." };
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `listqik-deal-memo-${input.calculatorSlug}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
  return { ok: true };
}

export function calculatorIdFromSlug(slug: string): CalculatorId | null {
  const map: Record<string, CalculatorId> = {
    mortgage: "mortgage",
    "reverse-invest": "reverse-invest",
    "note-buyer": "note-buyer",
    "present-value": "present-value",
    "rent-home": "rent-home",
    multifamily: "multifamily",
    "legacy-multifamily": "legacy-multifamily",
    "legacy-mortgage": "legacy-mortgage",
    "fix-and-flip": "fix-and-flip",
    rental: "rental",
    brrrr: "brrrr",
    wholesale: "wholesale",
  };
  return map[slug] ?? null;
}
