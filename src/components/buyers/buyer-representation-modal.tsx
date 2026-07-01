"use client";

import { useEffect, useMemo, useState } from "react";
import {
  REPRESENTATION_DURATION_OPTIONS,
  type BuyerRepresentationIntake,
} from "@/lib/buyers/representation-intake";

type InitialValues = Partial<
  Pick<BuyerRepresentationIntake, "fullName" | "phone" | "email" | "city" | "zip">
>;

export function BuyerRepresentationModal({
  open,
  onClose,
  onSubmit,
  initialValues = {},
  listingTitle,
  busy = false,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (intake: BuyerRepresentationIntake) => void | Promise<void>;
  initialValues?: InitialValues;
  listingTitle?: string;
  busy?: boolean;
  error?: string | null;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [propertyType, setPropertyType] = useState<"buy" | "lease">("buy");
  const [representationStart, setRepresentationStart] = useState("");
  const [representationDuration, setRepresentationDuration] = useState("90-days");

  useEffect(() => {
    if (!open) return;
    setFullName(initialValues.fullName ?? "");
    setPhone(initialValues.phone ?? "");
    setEmail(initialValues.email ?? "");
    setCity(initialValues.city ?? "");
    setZip(initialValues.zip ?? "");
  }, [open, initialValues]);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (fullName.trim().length < 2) return false;
    if (phone.trim().length < 7) return false;
    if (!email.includes("@")) return false;
    if (!city.trim()) return false;
    if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) return false;
    if (mailingAddress.trim().length < 5) return false;
    if (!representationStart.trim()) return false;
    return true;
  }, [
    busy,
    city,
    email,
    fullName,
    mailingAddress,
    phone,
    representationStart,
    zip,
  ]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    void onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      zip: zip.trim(),
      mailingAddress: mailingAddress.trim(),
      propertyType,
      representationStart: representationStart.trim(),
      representationDuration,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="buyer-rep-modal-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-sky-400/25 bg-[#0a120e] p-6 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">
          Buyer representation
        </p>
        <h2 id="buyer-rep-modal-title" className="mt-2 text-xl font-semibold text-white">
          Buyer Representation details
        </h2>
        {listingTitle ? (
          <p className="mt-1 text-sm text-emerald-200/90">Inquiry: {listingTitle}</p>
        ) : null}

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
          <p className="font-semibold text-white/90">What we collect (draft scope)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-white/70">
            <li>Your contact and mailing information for the agreement</li>
            <li>Target city and ZIP where you want representation</li>
            <li>Whether you are buying or leasing property</li>
            <li>When representation should start and how long it should last</li>
            <li>Listing context for this inquiry (attached automatically)</li>
          </ul>
          <p className="mt-3 text-xs text-white/50">
            This intake supports broker follow-up and a formal TREC Buyer Representation Agreement
            before any offer is submitted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ModalField label="Phone number">
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className={inputClass}
                placeholder="(555) 555-5555"
              />
            </ModalField>
            <ModalField label="Email address">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass}
                placeholder="you@domain.com"
              />
            </ModalField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ModalField label="City">
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                className={inputClass}
                placeholder="Austin"
              />
            </ModalField>
            <ModalField label="ZIP code">
              <input
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                autoComplete="postal-code"
                className={inputClass}
                placeholder="78704"
                pattern="\d{5}(-\d{4})?"
              />
            </ModalField>
          </div>

          <ModalField label="Full name">
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className={inputClass}
              placeholder="Legal full name"
            />
          </ModalField>

          <ModalField label="Current mailing address">
            <textarea
              required
              value={mailingAddress}
              onChange={(e) => setMailingAddress(e.target.value)}
              autoComplete="street-address"
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Street, city, state, ZIP"
            />
          </ModalField>

          <ModalField label="Type of property">
            <div className="flex gap-3">
              {(["buy", "lease"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                    propertyType === value
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-50"
                      : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={value}
                    checked={propertyType === value}
                    onChange={() => setPropertyType(value)}
                    className="sr-only"
                  />
                  {value}
                </label>
              ))}
            </div>
          </ModalField>

          <ModalField label="When would you like our representation to begin?">
            <input
              required
              type="date"
              value={representationStart}
              onChange={(e) => setRepresentationStart(e.target.value)}
              className={inputClass}
              min={new Date().toISOString().slice(0, 10)}
            />
          </ModalField>

          <ModalField label="How long would you like us to represent you?">
            <select
              value={representationDuration}
              onChange={(e) => setRepresentationDuration(e.target.value)}
              className={inputClass}
            >
              {REPRESENTATION_DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </ModalField>

          {error ? (
            <p className="rounded-xl border border-rose-400/30 bg-rose-950/30 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" disabled={!canSubmit} className="btn-primary disabled:opacity-60">
              {busy ? "Sending…" : "Send request"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/35"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-sky-400/40";

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-white/55">{label}</span>
      {children}
    </label>
  );
}
