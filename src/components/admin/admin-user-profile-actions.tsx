"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminUserProfileActionsProps = {
  userId: string;
  initialName: string;
  initialPhone: string;
  accountStatusLabel: string;
};

export function AdminUserProfileActions({
  userId,
  initialName,
  initialPhone,
  accountStatusLabel,
}: AdminUserProfileActionsProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [busy, setBusy] = useState<"save" | "resend" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile() {
    setBusy("save");
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Update failed.");
        return;
      }
      setMessage("Profile updated.");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function resendSetup() {
    setBusy("resend");
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/resend-setup`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Resend failed.");
        return;
      }
      setMessage("Setup link email sent.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-black/30 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-100/80">
        Account management
      </h4>
      <p className="mt-1 text-xs text-white/55">Status: {accountStatusLabel}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-white/70">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/70">
          Phone
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void saveProfile()}
          className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:opacity-50"
        >
          {busy === "save" ? "Saving…" : "Save profile"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void resendSetup()}
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 disabled:opacity-50"
        >
          {busy === "resend" ? "Sending…" : "Resend setup link"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
    </section>
  );
}
