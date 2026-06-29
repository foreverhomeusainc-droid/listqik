"use client";

import type { ReactNode } from "react";

export function InvLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-emerald-50/90">
      {children}
    </label>
  );
}

export function InvField({
  id,
  label,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step,
  type = "number",
}: {
  id?: string;
  label: string;
  prefix?: string;
  suffix?: string;
  value: string | number;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number | string;
  type?: "number" | "text";
}) {
  return (
    <div className="space-y-1.5">
      <InvLabel htmlFor={id}>{label}</InvLabel>
      <div className="flex min-w-0 items-stretch">
        {prefix ? (
          <span className="flex shrink-0 items-center rounded-l-lg border border-r-0 border-white/15 bg-black/50 px-3 text-sm text-white/45">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-w-0 flex-1 border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20 ${
            prefix && suffix ? "rounded-none" : prefix ? "rounded-r-lg" : suffix ? "rounded-l-lg" : "rounded-lg"
          }`}
        />
        {suffix ? (
          <span className="flex shrink-0 items-center rounded-r-lg border border-l-0 border-white/15 bg-black/50 px-3 text-sm text-white/45">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function InvSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <InvLabel htmlFor={id}>{label}</InvLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function InvResult({
  label,
  value,
  accent,
  className,
}: {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? "border-emerald-400/35 bg-gradient-to-br from-emerald-500/15 to-lime-500/5"
          : "border-white/10 bg-black/35"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-white/50">{label}</p>
      <p className={`mt-1 font-mono text-lg font-semibold ${className ?? "text-emerald-50"}`}>{value}</p>
    </div>
  );
}

export function InvError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
      {message}
    </p>
  );
}

export function InvPurpose({ children }: { children: ReactNode }) {
  return <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/60">{children}</p>;
}
