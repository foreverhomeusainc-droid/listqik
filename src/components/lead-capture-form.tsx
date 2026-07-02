"use client";

import { useMemo, useState } from "react";
import { BuyerRepresentationModal } from "@/components/buyers/buyer-representation-modal";
import type { BuyerRepresentationIntake } from "@/lib/buyers/representation-intake";

type LeadCaptureListingContext = {
  slug?: string;
  title?: string;
  city?: string;
  state?: string;
  price?: number;
  url?: string;
};

export function LeadCaptureForm({
  listing,
  source = "listings",
}: {
  listing?: LeadCaptureListingContext;
  source?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);

  const canOpenModal = useMemo(() => {
    if (status === "sending" || status === "success") return false;
    return consent;
  }, [consent, status]);

  function openBuyerRepModal() {
    if (!consent) {
      setError("Please agree to be contacted before sending a request.");
      return;
    }
    setError("");
    setModalError(null);
    setModalOpen(true);
  }

  async function submitWithBuyerRep(intake: BuyerRepresentationIntake) {
    setStatus("sending");
    setModalError(null);
    setError("");

    const utm = (() => {
      if (typeof window === "undefined") return {};
      const params = new URLSearchParams(window.location.search);
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
      return Object.fromEntries(keys.map((k) => [k, params.get(k) ?? undefined]));
    })();

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: intake.fullName,
        email: intake.email,
        phone: intake.phone,
        message: message.trim() || undefined,
        consent,
        source: `${source}-buyer-rep`,
        listing,
        buyerRepresentation: intake,
        utm,
        company: "",
      }),
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "Network error";
      setModalError(msg);
      setStatus("idle");
      return null;
    });

    if (!res) return;
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      const msg = data?.error || "Submission failed";
      setModalError(msg);
      setStatus("idle");
      return;
    }

    setName(intake.fullName);
    setEmail(intake.email);
    setPhone(intake.phone);
    setModalOpen(false);
    setStatus("success");
  }

  return (
    <>
      <div className="glass-surface p-6">
        <div className="text-xs font-semibold tracking-widest text-white/60">GET UPDATES</div>
        <h2 className="mt-2 text-lg font-semibold text-white">Request info</h2>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll follow up quickly with availability, disclosures, and next steps. Buyer
          Representation details are collected before your request is sent.
        </p>

        {status === "success" ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white">Submitted.</div>
            <div className="mt-1 text-sm text-muted">
              Thanks — our team will reach out shortly with buyer representation next steps.
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={fieldInputClass}
                  placeholder="Full name (optional — confirm in next step)"
                />
              </Field>
              <Field label="Email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className={fieldInputClass}
                  placeholder="you@domain.com"
                />
              </Field>
            </div>

            <Field label="Phone (optional)">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                autoComplete="tel"
                className={fieldInputClass}
                placeholder="(555) 555-5555"
              />
            </Field>

            <Field label="Message (optional)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`${fieldInputClass} resize-none`}
                placeholder="Questions, timeline, financing status…"
              />
            </Field>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 accent-[color:var(--lp-accent)]"
              />
              <span>
                I agree to be contacted about this listing, broker-facilitated real estate services,
                and related marketing support.
              </span>
            </label>

            {error ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-[color:var(--lp-danger)]">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!canOpenModal}
              onClick={openBuyerRepModal}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send request
            </button>

            <p className="text-xs text-white/50">
              Next: complete Buyer Representation details. Your request is saved securely for our
              team — no third-party CRM required.
            </p>
          </div>
        )}
      </div>

      <BuyerRepresentationModal
        open={modalOpen}
        onClose={() => {
          if (status !== "sending") setModalOpen(false);
        }}
        onSubmit={submitWithBuyerRep}
        initialValues={{
          fullName: name,
          email,
          phone,
          city: listing?.city ?? "",
        }}
        listingTitle={listing?.title}
        busy={status === "sending"}
        error={modalError}
      />
    </>
  );
}

const fieldInputClass =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold tracking-widest text-white/60">{label.toUpperCase()}</span>
      {children}
    </label>
  );
}
