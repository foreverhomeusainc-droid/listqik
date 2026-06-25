"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { CalculatorAccess } from "@/lib/calculators/access";

export function CalculatorGatingBanner({
  access,
  memberBasePath,
}: {
  access: CalculatorAccess | null;
  memberBasePath: string;
}) {
  if (!access) return null;

  if (!access.isAuthenticated) {
    return (
      <div className="rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-100">
        <p>
          Sandbox mode:{" "}
          {access.runsRemaining === null
            ? "unlimited"
            : `${access.runsRemaining} run${access.runsRemaining === 1 ? "" : "s"} left today`}{" "}
          per calculator.
        </p>
        <p className="mt-1 text-amber-100/80">
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>{" "}
          for unlimited analysis, Push to Live Listing, and Velocity Club perks.
        </p>
      </div>
    );
  }

  if (!access.canExportPdf) {
    return (
      <div className="rounded-xl border border-sky-400/25 bg-sky-950/15 px-4 py-3 text-sm text-sky-100">
        Scout access: unlimited runs + Push to Live Listing active.{" "}
        <Link href={`${memberBasePath}/velocity-club`} className="font-semibold underline">
          Reach Syndicate tier
        </Link>{" "}
        to unlock Deal Memo PDF export.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-lime-400/30 bg-lime-950/15 px-4 py-3 text-sm text-lime-100">
      Syndicate+ access: unlimited runs, Push to Live Listing, and Deal Memo PDF export enabled.
    </div>
  );
}

export function CalculatorShell({
  kicker,
  title,
  description,
  children,
  actions,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-black/45 p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">{kicker}</p>
          <h1 className="mt-2 text-2xl font-semibold text-emerald-50 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

import { useState } from "react";

export type CalculatorAddressState = {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  setStreet: (v: string) => void;
  setUnit: (v: string) => void;
  setCity: (v: string) => void;
  setState: (v: string) => void;
  setZip: (v: string) => void;
};

export function useCalculatorAddress(): CalculatorAddressState {
  const [street, setStreet] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Texas");
  const [zip, setZip] = useState("");
  return { street, unit, city, state, zip, setStreet, setUnit, setCity, setState, setZip };
}

export function CalculatorAddressFields({
  street,
  unit,
  city,
  state,
  zip,
  setStreet,
  setUnit,
  setCity,
  setState,
  setZip,
}: CalculatorAddressState) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200/75">
        Property address (optional — improves Push to Live prefill)
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <CalcTextField label="Street" value={street} onChange={setStreet} className="sm:col-span-2" />
        <CalcTextField label="Unit" value={unit} onChange={setUnit} />
        <CalcTextField label="City" value={city} onChange={setCity} />
        <CalcTextField label="State" value={state} onChange={setState} />
        <CalcTextField label="ZIP" value={zip} onChange={setZip} />
      </div>
    </div>
  );
}

function CalcTextField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={["block space-y-1.5", className].filter(Boolean).join(" ")}>
      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-200/75">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-emerald-50 outline-none focus:border-emerald-400/50"
      />
    </label>
  );
}

export function CalcField({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  type?: "number" | "range";
  min?: number;
  max?: number;
  step?: number;
}) {
  const num = typeof value === "number" ? value : Number(value);
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-200/75">
        <span className="min-w-0 truncate">{label}</span>
        {type === "number" ? (
          <span className="shrink-0 font-mono tabular-nums text-emerald-100">{num.toLocaleString()}</span>
        ) : null}
      </div>
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={num}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-400"
      />
    </label>
  );
}

export function ResultGrid({ rows }: { rows: Array<{ label: string; value: string; accent?: boolean }> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="rounded-xl border border-white/10 bg-black/35 px-3 py-3"
        >
          <p className="text-[11px] uppercase tracking-wide text-white/50">{row.label}</p>
          <p
            className={`mt-1 text-lg font-semibold tabular-nums ${row.accent ? "text-lime-300" : "text-emerald-50"}`}
          >
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function pct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}
