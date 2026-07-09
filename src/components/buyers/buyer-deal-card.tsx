import Link from "next/link";
import { DealCardImageCarousel } from "@/components/buyers/deal-card-image-carousel";
import { buyerDealImageUrls } from "@/lib/buyers/deal-images";
import type { BuyerDealTeaser } from "@/lib/buyers/types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function BuyerDealCard({
  deal,
  mode = "preview",
  href,
  street,
  privateRemarks,
  saved,
  onToggleSave,
  showArv = false,
  showMarketValue = true,
  dealLabel,
}: {
  deal: BuyerDealTeaser;
  mode?: "preview" | "full";
  href?: string;
  street?: string;
  privateRemarks?: string;
  saved?: boolean;
  onToggleSave?: (saved: boolean) => void;
  showArv?: boolean;
  showMarketValue?: boolean;
  dealLabel?: string;
}) {
  const images = buyerDealImageUrls(deal);
  const imageAlt = `${deal.city} buyer deal`;
  const amv = deal.approximateMarketValue;
  const hasMarketGap =
    showMarketValue && amv != null && amv > 0 && amv > deal.listPrice;
  const belowMarket = hasMarketGap ? amv - deal.listPrice : 0;

  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <DealCardImageCarousel images={images} alt={imageAlt} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/40 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
            {deal.status}
          </span>
          {deal.domDays != null ? (
            <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/85">
              {deal.domDays} days on market
            </span>
          ) : null}
        </div>
        {dealLabel ? (
          <div className="absolute bottom-3 right-3 rounded-full border border-lime-400/50 bg-lime-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-lime-100">
            {dealLabel}
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
            <p className="text-xs text-white/50">{mode === "preview" ? "Starts at" : "List price"}</p>
            <p className="font-mono text-sm font-semibold text-lime-200">{money(deal.listPrice)}</p>
            {showMarketValue && amv != null && amv > 0 ? (
              <>
                <p className="mt-1 text-xs text-white/50">Approx. market value</p>
                <p className="font-mono text-sm font-semibold text-sky-200">{money(amv)}</p>
              </>
            ) : null}
            {showArv && deal.arvEstimate != null && deal.arvEstimate > 0 ? (
              <>
                <p className="mt-1 text-xs text-white/50">ARV</p>
                <p className="font-mono text-sm font-semibold text-amber-200">
                  {money(deal.arvEstimate)}
                </p>
              </>
            ) : null}
          </div>
        </div>
        {hasMarketGap ? (
          <p className="mt-3 rounded-lg border border-lime-500/25 bg-lime-950/25 px-3 py-2 text-xs font-medium text-lime-100/95">
            Listed about {money(belowMarket)} below approximate market value — see why this is a deal.
          </p>
        ) : null}
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
          <p className="mt-4 text-xs text-white/55">
            Sign Buyer Representation to unlock the full address, private remarks, and comps.
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
