import Link from "next/link";
import { LEGACY_CALCULATOR_CATALOG } from "@/lib/calculators/types";

export function InvestorLegacyCalculatorGrid({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="space-y-5" id="legacy-calculators">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/70">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold text-amber-50 sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm text-white/65">{intro}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LEGACY_CALCULATOR_CATALOG.map((calc) => (
          <Link
            key={calc.id}
            href={`/calculators/legacy/${calc.slug}`}
            className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-amber-400/35 hover:bg-amber-950/15"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/60">
              {calc.investorFocus}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-amber-50 group-hover:text-amber-100">
              {calc.name}
            </h4>
            <p className="mt-2 text-sm text-white/65">{calc.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
