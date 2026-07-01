import Image from "next/image";
import Link from "next/link";
import type { BuyerDealTeaser } from "@/lib/buyers/types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

export function BuyerDealCard({
  deal,
  mode = "teaser",
  href,
  street,
  privateRemarks,
  saved,
  onToggleSave,
  showArv = false,
}: {
  deal: BuyerDealTeaser;
  mode?: "teaser" | "full";
  href?: string;
  street?: string;
  privateRemarks?: string;
  saved?: boolean;
  onToggleSave?: (saved: boolean) => void;
  showArv?: boolean;
}) {
  const image = deal.heroImageUrl || FALLBACK_IMAGE;
  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={`${deal.city} investor deal`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/40 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
            {deal.status}
          </span>
          {deal.domDays != null ? (
            <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/85">
              {deal.domDays} DOM
            </span>
          ) : null}
        </div>
        {mode === "teaser" ? (
          <div className="absolute bottom-3 right-3 rounded-full border border-amber-400/40 bg-amber-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
            Teaser
          </div>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-white">
              {mode === "full" && street ? `${street}, ` : ""}
              {deal.city}, {deal.state} · {deal.zip}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {deal.beds ?? "—"} bd · {deal.baths ?? "—"} ba ·{" "}
              {deal.sqft ? deal.sqft.toLocaleString() : "—"} sqft
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">List</p>
            <p className="font-mono text-sm font-semibold text-lime-200">{money(deal.listPrice)}</p>
            {showArv && deal.arvEstimate != null && deal.arvEstimate > 0 ? (
              <p className="mt-1 text-xs text-white/50">ARV</p>
            ) : null}
            {showArv && deal.arvEstimate != null && deal.arvEstimate > 0 ? (
              <p className="font-mono text-sm font-semibold text-amber-200">{money(deal.arvEstimate)}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {deal.investorTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-emerald-500/25 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/90"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/75 line-clamp-2">{deal.publicRemarks}</p>
        {mode === "full" && privateRemarks ? (
          <p className="mt-2 text-xs text-sky-100/80 line-clamp-3">
            <span className="font-semibold text-sky-200">Private: </span>
            {privateRemarks}
          </p>
        ) : null}
        {mode === "full" ? (
          <p className="mt-3 text-xs font-semibold text-lime-300/90">Investor score {deal.investorScore}</p>
        ) : (
          <p className="mt-4 text-xs text-amber-100/70">
            Sign Buyer Rep to unlock address, private remarks, and comps.
          </p>
        )}
        {mode === "full" && onToggleSave ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(!saved);
            }}
            className="mt-3 text-xs font-semibold text-amber-200/90 transition hover:text-amber-100"
          >
            {saved ? "★ Saved" : "☆ Save"}
          </button>
        ) : null}
      </div>
    </>
  );

  const className =
    "group glass-surface block overflow-hidden transition hover:border-emerald-400/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <article className={className}>{body}</article>;
}
