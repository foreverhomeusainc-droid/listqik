"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminInviteUserPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone: phone || undefined }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        userId?: string;
        emailSent?: boolean;
        emailError?: string | null;
      };

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Invite failed.");
        return;
      }

      setEmail("");
      setName("");
      setPhone("");
      const emailNote = data.emailSent
        ? "Setup email sent."
        : data.emailError
          ? `User created but email failed: ${data.emailError}`
          : "User created.";
      setMessage(emailNote);
      router.refresh();
      if (data.userId) {
        router.push(`/dashboard/admin/users/${data.userId}`);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
      <h3 className="text-sm font-semibold text-emerald-100">Invite user</h3>
      <p className="mt-1 text-xs text-white/60">
        Creates an account and emails a password setup link (same flow as post-checkout provisioning).
      </p>
      <form className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
        <label className="block text-xs text-white/70 sm:col-span-2">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/70">
          Name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/70">
          Phone (optional)
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:opacity-50"
          >
            {busy ? "Sending…" : "Create & send setup link"}
          </button>
        </div>
      </form>
      {message ? <p className="mt-3 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
    </section>
  );
}
