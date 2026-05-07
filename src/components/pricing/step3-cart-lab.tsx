"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/container";
import { staticWizardUpgrades } from "@/data/pricing-static-upgrades";
import type { PlanId, WizardUpgrade } from "@/types/pricing-wizard";

type PlanRow = {
  id: PlanId;
  name: string;
  price: string;
  closeFee: string;
};

const plans: PlanRow[] = [
  { id: "subsonic", name: "Subsonic", price: "$99", closeFee: "0.50% at closing" },
  { id: "supersonic", name: "Supersonic", price: "$295", closeFee: "0.30% at closing" },
  { id: "hypersonic", name: "Hypersonic", price: "$595", closeFee: "0.25% at closing" },
];

export function Step3CartLab() {
  const [checkoutSessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `step3-lab-${Date.now()}`,
  );
  const [planId, setPlanId] = useState<PlanId>("supersonic");
  const [fullName, setFullName] = useState("Step 3 Test Buyer");
  const [email, setEmail] = useState("step3-test@example.com");
  const [phone, setPhone] = useState("5555555555");
  const [address, setAddress] = useState("123 Test Drive");
  const [city, setCity] = useState("Houston");
  const [stateCode, setStateCode] = useState("TX");
  const [zip, setZip] = useState("77001");
  const [county, setCounty] = useState("Harris");
  const [propertyType, setPropertyType] = useState("single-family");
  const [upgrades, setUpgrades] = useState<WizardUpgrade[]>(staticWizardUpgrades);
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingUpgrades, setLoadingUpgrades] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [responseMode, setResponseMode] = useState("");

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === planId) ?? plans[0],
    [planId],
  );

  const selectedRows = useMemo(
    () => upgrades.filter((u) => selected.includes(u.slug)),
    [selected, upgrades],
  );

  const payload = useMemo(
    () => ({
      checkoutSessionId,
      checkoutKind: "upgrades" as const,
      source: "step3-lab",
      plan: {
        id: selectedPlan.id,
        name: selectedPlan.name,
        price: selectedPlan.price,
        closeFee: selectedPlan.closeFee,
      },
      contact: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      property: {
        address: address.trim(),
        city: city.trim(),
        state: stateCode.trim(),
        zip: zip.trim(),
        county: county.trim(),
        propertyType: propertyType.trim(),
      },
      upgrades: selectedRows.map((u) => ({
        slug: u.slug,
        name: u.name,
        price: u.price,
        ghlProductId: u.ghlProductId,
      })),
    }),
    [
      checkoutSessionId,
      selectedPlan,
      fullName,
      email,
      phone,
      address,
      city,
      stateCode,
      zip,
      county,
      propertyType,
      selectedRows,
    ],
  );

  async function loadUpgrades() {
    setLoadingUpgrades(true);
    setError("");
    const res = await fetch("/api/ghl/pricing/upgrades", { cache: "no-store" }).catch(() => null);
    setLoadingUpgrades(false);
    if (!res) {
      setError("Network error while loading upgrades.");
      return;
    }
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; upgrades?: WizardUpgrade[]; warning?: string | null }
      | null;
    if (!res.ok || !data?.ok || !Array.isArray(data.upgrades) || data.upgrades.length === 0) {
      setError("Could not load upgrades from GHL endpoint.");
      return;
    }
    setUpgrades(data.upgrades);
    setWarning(data.warning ?? "");
    setSelected([]);
  }

  function toggleUpgrade(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((v) => v !== slug) : [...current, slug],
    );
  }

  async function generateCheckout() {
    if (selectedRows.length === 0) {
      setError("Select at least one upgrade.");
      return;
    }
    setSubmitting(true);
    setError("");
    setWarning("");
    setCheckoutUrl("");
    setResponseMode("");
    const res = await fetch("/api/ghl/pricing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setSubmitting(false);
    if (!res) {
      setError("Network error while generating checkout.");
      return;
    }
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; checkoutUrl?: string | null; warning?: string; error?: string; mode?: string }
      | null;
    if (!res.ok || !data?.ok || !data.checkoutUrl) {
      setError(data?.error || "Checkout URL was not generated.");
      return;
    }
    setCheckoutUrl(data.checkoutUrl);
    setWarning(data.warning ?? "");
    setResponseMode(data.mode ?? "");
  }

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
          <h1 className="text-2xl font-semibold text-white">Step 3 Cart Lab</h1>
          <p className="mt-2 text-sm text-white/75">
            Isolated tester for dynamic upgrades checkout. Select upgrades, generate checkout, and
            verify which items make it into the GHL cart.
          </p>
          <p className="mt-2 text-xs text-white/60">Session: {checkoutSessionId}</p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/15 bg-black/20 p-5 md:grid-cols-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Plan</span>
            <select
              className="rounded border border-white/20 bg-black/40 px-3 py-2 text-white"
              value={planId}
              onChange={(e) => setPlanId(e.target.value as PlanId)}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Full name" value={fullName} onChange={setFullName} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Address" value={address} onChange={setAddress} />
          <Field label="City" value={city} onChange={setCity} />
          <Field label="State" value={stateCode} onChange={setStateCode} />
          <Field label="ZIP" value={zip} onChange={setZip} />
          <Field label="County" value={county} onChange={setCounty} />
          <Field label="Property Type" value={propertyType} onChange={setPropertyType} />
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                void loadUpgrades();
              }}
              disabled={loadingUpgrades}
            >
              {loadingUpgrades ? "Loading..." : "Reload upgrades from /api/ghl/pricing/upgrades"}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                void generateCheckout();
              }}
              disabled={submitting || selectedRows.length === 0}
            >
              {submitting ? "Generating..." : "Generate dynamic upgrades checkout"}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {upgrades.map((u) => {
              const active = selected.includes(u.slug);
              return (
                <button
                  key={`${u.slug}:${u.ghlProductId}`}
                  type="button"
                  onClick={() => toggleUpgrade(u.slug)}
                  className={[
                    "rounded-xl border px-3 py-3 text-left",
                    active ? "border-emerald-400/60 bg-emerald-500/10" : "border-white/15 bg-black/25",
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold text-white">{u.name}</div>
                  <div className="mt-1 text-xs text-white/70">{u.slug}</div>
                  <div className="mt-1 text-xs text-white/70">Product: {u.ghlProductId}</div>
                  <div className="mt-2 text-sm text-white">${u.price}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <h2 className="mb-2 text-sm font-semibold text-white">Payload Preview</h2>
            <pre className="max-h-[420px] overflow-auto rounded bg-black/40 p-3 text-xs text-white/85">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <h2 className="mb-2 text-sm font-semibold text-white">Result</h2>
            <div className="space-y-2 text-sm">
              <div className="text-white/80">Selected upgrades: {selectedRows.length}</div>
              <div className="text-white/80">Mode: {responseMode || "n/a"}</div>
              <div className="break-all text-white/80">
                Checkout URL: {checkoutUrl ? checkoutUrl : "not generated"}
              </div>
              {warning ? <div className="text-amber-300">Warning: {warning}</div> : null}
              {error ? <div className="text-red-300">Error: {error}</div> : null}
            </div>
          </div>
        </div>

        {checkoutUrl ? (
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <iframe
              title="Step 3 checkout test"
              src={checkoutUrl}
              className="h-[75vh] min-h-[640px] w-full rounded-xl border border-white/15 bg-black/20"
              loading="lazy"
              allow="payment *"
            />
          </div>
        ) : null}
      </Container>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-white/20 bg-black/40 px-3 py-2 text-white"
      />
    </label>
  );
}
