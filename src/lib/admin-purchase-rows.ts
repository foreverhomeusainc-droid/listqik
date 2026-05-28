import {
  extractGenericCouponCode,
  extractStripeCheckoutCouponCode,
} from "@/lib/stripe-purchase-details";

export type AdminPurchaseRow = {
  id: string;
  kind: "plan" | "upgrade";
  sortAt: number;
  purchasedAtLabel: string;
  purchaserEmail: string;
  userName: string | null;
  userId: string | null;
  summary: string;
  detail: string;
  amountLabel: string;
  couponCode: string;
  paymentStatus: string;
  orderRef: string;
  checkoutSessionId: string | null;
};

type UserLookup = { _id: unknown; email?: string | null; name?: string | null };

type PlanDoc = {
  _id: unknown;
  purchaserEmail?: string | null;
  userId?: unknown;
  planId?: string | null;
  planName?: string | null;
  status?: string | null;
  purchasedAt?: Date | string | null;
  createdAt?: Date | string | null;
  amountTotal?: number | null;
  currency?: string | null;
  couponCode?: string | null;
  paymentStatus?: string | null;
  externalOrderId?: string | null;
};

type UpgradeDoc = {
  _id: unknown;
  purchaserEmail?: string | null;
  userId?: unknown;
  externalUserId?: string | null;
  upgradeSlugs?: string[] | null;
  items?: Array<{ name?: string | null }> | null;
  purchasedAt?: Date | string | null;
  createdAt?: Date | string | null;
  amountTotal?: number | null;
  currency?: string | null;
  paymentStatus?: string | null;
  externalOrderId?: string | null;
  checkoutSessionId?: string | null;
  rawPayload?: unknown;
};

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amount: number | null | undefined, currency: string | null | undefined): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) return "—";
  const cur = (currency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function sortKey(purchasedAt: Date | string | null | undefined, createdAt: Date | string | null | undefined): number {
  const primary = purchasedAt ? new Date(purchasedAt).getTime() : NaN;
  const fallback = createdAt ? new Date(createdAt).getTime() : 0;
  return Number.isFinite(primary) ? primary : fallback;
}

export function buildAdminPurchaseRows(input: {
  plans: PlanDoc[];
  upgrades: UpgradeDoc[];
  users: UserLookup[];
}): AdminPurchaseRow[] {
  const userById = new Map(input.users.map((u) => [String(u._id), u]));
  const userByEmail = new Map(input.users.map((u) => [u.email?.trim().toLowerCase() ?? "", u]));
  const rows: AdminPurchaseRow[] = [];

  for (const plan of input.plans) {
    const email = plan.purchaserEmail?.trim().toLowerCase() ?? "";
    const userId = plan.userId ? String(plan.userId) : null;
    const user = (userId && userById.get(userId)) || (email ? userByEmail.get(email) : undefined);

    rows.push({
      id: `plan-${String(plan._id)}`,
      kind: "plan",
      sortAt: sortKey(plan.purchasedAt, plan.createdAt),
      purchasedAtLabel: formatDate(plan.purchasedAt ?? plan.createdAt),
      purchaserEmail: plan.purchaserEmail ?? "—",
      userName: user?.name ?? null,
      userId: user ? String(user._id) : userId,
      summary: plan.planName || plan.planId || "Listing plan",
      detail: `Plan ID: ${plan.planId} · Status: ${plan.status ?? "—"}`,
      amountLabel: formatMoney(plan.amountTotal ?? null, plan.currency ?? "usd"),
      couponCode: plan.couponCode?.trim() || "—",
      paymentStatus: plan.paymentStatus?.trim() || "—",
      orderRef: plan.externalOrderId?.trim() || "—",
      checkoutSessionId: null,
    });
  }

  for (const upgrade of input.upgrades) {
    const email = upgrade.purchaserEmail?.trim().toLowerCase() ?? "";
    const userId = upgrade.userId
      ? String(upgrade.userId)
      : upgrade.externalUserId && /^[a-f0-9]{24}$/i.test(upgrade.externalUserId)
        ? upgrade.externalUserId
        : null;
    const user = (userId && userById.get(userId)) || (email ? userByEmail.get(email) : undefined);

    const slugs = (upgrade.upgradeSlugs ?? []).filter((s) => typeof s === "string" && s.trim());
    const itemNames = (upgrade.items ?? [])
      .map((item) => item?.name?.trim())
      .filter((name): name is string => Boolean(name));

    const couponCode =
      extractStripeCheckoutCouponCode(upgrade.rawPayload) ||
      extractGenericCouponCode(upgrade.rawPayload) ||
      "—";

    const summary =
      itemNames.length > 0
        ? itemNames.join(", ")
        : slugs.length > 0
          ? slugs.join(", ")
          : "Upgrade purchase";

    rows.push({
      id: `upgrade-${String(upgrade._id)}`,
      kind: "upgrade",
      sortAt: sortKey(upgrade.purchasedAt, upgrade.createdAt),
      purchasedAtLabel: formatDate(upgrade.purchasedAt ?? upgrade.createdAt),
      purchaserEmail: upgrade.purchaserEmail ?? "—",
      userName: user?.name ?? null,
      userId: user ? String(user._id) : userId,
      summary,
      detail:
        slugs.length > 0
          ? `${slugs.length} upgrade slug(s) · ${upgrade.items?.length ?? 0} line item(s)`
          : `${upgrade.items?.length ?? 0} line item(s)`,
      amountLabel: formatMoney(upgrade.amountTotal ?? null, upgrade.currency ?? "usd"),
      couponCode,
      paymentStatus: upgrade.paymentStatus?.trim() || "—",
      orderRef: upgrade.externalOrderId?.trim() || upgrade.checkoutSessionId?.trim() || "—",
      checkoutSessionId: upgrade.checkoutSessionId?.trim() || null,
    });
  }

  rows.sort((a, b) => b.sortAt - a.sortAt);
  return rows;
}
