"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/container";

export function BuyerRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/buyers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }
      setMessage(data.message ?? "Check your email to finish setup.");
    } catch {
      setError("Network error. Try again or email concierge@listqik.com.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-lg space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
              Buyer access
            </p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Request buyer account</h1>
            <p className="text-sm text-white/70">
              We&apos;ll email you a secure link to set your password. After sign-in, complete Buyer
              Representation to unlock the full MLS feed.
            </p>
          </header>

          <form
            onSubmit={(e) => void onSubmit(e)}
            className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-6"
          >
            <label className="block space-y-1.5 text-sm">
              <span className="text-white/70">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-white/70">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-white/70">Phone (optional)</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>

            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {message ? <p className="text-sm text-lime-200">{message}</p> : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full border border-lime-400/60 bg-lime-500/20 py-2.5 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
            >
              {busy ? "Submitting…" : "Request access"}
            </button>
          </form>

          <p className="text-center text-sm text-white/55">
            Already have an account?{" "}
            <Link href="/login?callbackUrl=/buyer-representation" className="text-emerald-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
