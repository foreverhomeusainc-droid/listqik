"use client";

import { useCallback, useEffect, useState } from "react";

type TemplateRecord = {
  key: string;
  label: string;
  description: string;
  variables: string[];
  subject: string;
  textBody: string;
  htmlBody: string;
  isCustom: boolean;
  updatedAt: string | null;
};

type Draft = {
  subject: string;
  textBody: string;
  htmlBody: string;
};

export function AdminEmailTemplatesForm() {
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selected = templates.find((t) => t.key === selectedKey) ?? null;

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-templates", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; templates?: TemplateRecord[]; error?: string }
        | null;
      if (!res.ok || !data?.ok || !data.templates) {
        setError(data?.error ?? "Could not load email templates.");
        return;
      }
      setTemplates(data.templates);
      setSelectedKey((prev) => {
        if (prev && data.templates?.some((t) => t.key === prev)) return prev;
        return data.templates?.[0]?.key ?? null;
      });
    } catch {
      setError("Could not load email templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    if (!selectedKey) {
      setDraft(null);
      return;
    }
    const t = templates.find((item) => item.key === selectedKey);
    if (!t) {
      setDraft(null);
      return;
    }
    setDraft({
      subject: t.subject,
      textBody: t.textBody,
      htmlBody: t.htmlBody,
    });
    setSuccess(null);
    setError(null);
  }, [selectedKey, templates]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !draft || busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/email-templates", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          key: selected.key,
          subject: draft.subject,
          textBody: draft.textBody,
          htmlBody: draft.htmlBody,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; template?: TemplateRecord; error?: string }
        | null;
      if (!res.ok || !data?.ok || !data.template) {
        setError(data?.error ?? "Save failed.");
        return;
      }
      setTemplates((prev) => prev.map((t) => (t.key === data.template!.key ? data.template! : t)));
      setSuccess("Template saved.");
    } catch {
      setError("Network error while saving.");
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!selected || busy) return;
    if (!window.confirm(`Reset "${selected.label}" to the built-in default?`)) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/email-templates?key=${encodeURIComponent(selected.key)}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; template?: TemplateRecord; error?: string }
        | null;
      if (!res.ok || !data?.ok || !data.template) {
        setError(data?.error ?? "Reset failed.");
        return;
      }
      setTemplates((prev) => prev.map((t) => (t.key === data.template!.key ? data.template! : t)));
      setSuccess("Template reset to default.");
    } catch {
      setError("Network error while resetting.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/15 bg-black/30 p-4 sm:p-6">
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-emerald-100">Email notification templates</h3>
        <p className="text-sm text-white/65">
          Edit subjects and bodies for automated emails. Use placeholders like{" "}
          <code className="rounded bg-black/40 px-1 font-mono text-xs">{"{{greetingName}}"}</code>.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-white/55">Loading templates…</p>
      ) : error && templates.length === 0 ? (
        <p className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,240px)_1fr]">
          <nav className="space-y-1">
            {templates.map((t) => {
              const active = t.key === selectedKey;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSelectedKey(t.key)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "border-emerald-400/45 bg-emerald-950/30 text-emerald-50"
                      : "border-white/10 bg-black/20 text-white/80 hover:border-white/20"
                  }`}
                >
                  <span className="block font-medium">{t.label}</span>
                  {t.isCustom ? (
                    <span className="mt-0.5 block text-xs text-emerald-300/80">Customized</span>
                  ) : (
                    <span className="mt-0.5 block text-xs text-white/45">Default</span>
                  )}
                </button>
              );
            })}
          </nav>

          {selected && draft ? (
            <form onSubmit={onSave} className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/25 p-3 sm:p-4">
                <h4 className="font-medium text-emerald-50">{selected.label}</h4>
                <p className="mt-1 text-xs text-white/55">{selected.description}</p>
                {selected.isCustom && selected.updatedAt ? (
                  <p className="mt-2 text-xs text-white/40">
                    Last saved {new Date(selected.updatedAt).toLocaleString()}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.variables.map((v) => (
                    <code
                      key={v}
                      className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-emerald-200/90"
                    >
                      {`{{${v}}}`}
                    </code>
                  ))}
                </div>
              </div>

              <label className="block space-y-1.5 text-sm">
                <span className="text-white/70">Subject</span>
                <input
                  type="text"
                  required
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white"
                />
              </label>

              <label className="block space-y-1.5 text-sm">
                <span className="text-white/70">Plain-text body</span>
                <textarea
                  required
                  rows={14}
                  value={draft.textBody}
                  onChange={(e) => setDraft({ ...draft, textBody: e.target.value })}
                  className="w-full resize-y rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs leading-relaxed text-white"
                />
              </label>

              <label className="block space-y-1.5 text-sm">
                <span className="text-white/70">
                  HTML body{" "}
                  <span className="text-white/45">(optional — leave blank to auto-generate from plain text)</span>
                </span>
                <textarea
                  rows={10}
                  value={draft.htmlBody}
                  onChange={(e) => setDraft({ ...draft, htmlBody: e.target.value })}
                  placeholder="<p>Hi {{greetingName}},</p>"
                  className="w-full resize-y rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs leading-relaxed text-white placeholder:text-white/30"
                />
              </label>

              {error ? (
                <p className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="rounded-lg border border-emerald-500/35 bg-emerald-950/25 px-3 py-2 text-sm text-emerald-100">
                  {success}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full border border-emerald-400/45 bg-emerald-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save template"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onReset}
                  className="rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-black/55 disabled:opacity-50"
                >
                  Reset to default
                </button>
              </div>
            </form>
          ) : null}
        </div>
      )}
    </div>
  );
}
