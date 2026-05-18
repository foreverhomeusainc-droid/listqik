import { getHomepageCopy } from "@/i18n/homepage-copy";
import type { HomeLocale } from "@/i18n/home-locale";

export function ComparisonTable({ locale = "en" }: { locale?: HomeLocale }) {
  const t = getHomepageCopy(locale).comparison;

  return (
    <div className="glass-surface p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold tracking-widest text-white/60">{t.kicker}</div>
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-2xl">{t.title}</h2>
        <p className="text-sm text-muted">{t.subtitle}</p>
      </div>

      <div className="mt-4 overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 sm:mt-6">
        <p className="px-3 py-2 text-[11px] text-white/45 sm:hidden">{t.swipeHint}</p>
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm sm:min-w-[760px]">
          <thead>
            <tr className="bg-white/5">
              <Th>{t.capability}</Th>
              <Th highlight>ListQik.com</Th>
              <Th>Houzeo</Th>
              <Th>Beycome</Th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => (
              <Tr
                key={row.label}
                label={row.label}
                lp={row.listQik}
                h={row.houzeo}
                b={row.beycome}
                emphasis={row.emphasis}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-white/50">{t.disclaimer}</p>
    </div>
  );
}

function Th({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <th
      scope="col"
      className={["px-4 py-3 font-semibold text-white/70", highlight ? "text-white" : ""].join(" ")}
    >
      {children}
    </th>
  );
}

function Tr({
  label,
  lp,
  h,
  b,
  emphasis,
}: {
  label: string;
  lp: string;
  h: string;
  b: string;
  emphasis?: boolean;
}) {
  return (
    <tr className="border-t border-white/10">
      <td className="px-4 py-3 text-white/75">{label}</td>
      <td className={["px-4 py-3", emphasis ? "font-semibold text-white" : "text-white/85"].join(" ")}>
        {lp}
      </td>
      <td className="px-4 py-3 text-white/70">{h}</td>
      <td className="px-4 py-3 text-white/70">{b}</td>
    </tr>
  );
}

