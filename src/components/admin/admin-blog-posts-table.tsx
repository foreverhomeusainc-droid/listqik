"use client";

import { useMemo, useState } from "react";
import type { BlogLocale } from "@/lib/blog-locale";

export type AdminBlogListItem = {
  slug: string;
  locale: BlogLocale;
  title: string;
  category: string;
  status: "draft" | "published";
  publishedAt: string;
  updatedAt: string | null;
};

export function postKey(post: { slug: string; locale: BlogLocale }) {
  return `${post.locale}:${post.slug}`;
}

type LocaleFilter = "all" | BlogLocale;
type StatusFilter = "all" | "draft" | "published";

type Props = {
  posts: AdminBlogListItem[];
  loading: boolean;
  selectedKey: string | null;
  selectedKeys: Set<string>;
  bulkBusy: boolean;
  onToggleSelect: (key: string) => void;
  onToggleSelectAll: (keys: string[]) => void;
  onSelectPost: (key: string) => void;
  onBulkAction: (action: "publish" | "draft" | "delete") => void;
};

export function AdminBlogPostsTable({
  posts,
  loading,
  selectedKey,
  selectedKeys,
  bulkBusy,
  onToggleSelect,
  onToggleSelectAll,
  onSelectPost,
  onBulkAction,
}: Props) {
  const [localeFilter, setLocaleFilter] = useState<LocaleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (localeFilter !== "all" && p.locale !== localeFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [posts, localeFilter, statusFilter, search]);

  const visibleKeys = filtered.map((p) => postKey(p));
  const allVisibleSelected =
    visibleKeys.length > 0 && visibleKeys.every((k) => selectedKeys.has(k));
  const someSelected = selectedKeys.size > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-emerald-100">All posts</h3>
          <p className="mt-0.5 text-xs text-white/55">
            {loading ? "Loading…" : `${filtered.length} of ${posts.length} shown`}
            {someSelected ? ` · ${selectedKeys.size} selected` : ""}
          </p>
        </div>
        <input
          type="search"
          placeholder="Search title, slug, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "en", "es"] as LocaleFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setLocaleFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              localeFilter === f
                ? "bg-emerald-600/80 text-white"
                : "border border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {f === "all" ? "All languages" : f.toUpperCase()}
          </button>
        ))}
        {(["all", "draft", "published"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              statusFilter === f
                ? "bg-white/15 text-white"
                : "border border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {f === "all" ? "All status" : f === "draft" ? "Draft" : "Published"}
          </button>
        ))}
      </div>

      {someSelected ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/25 px-3 py-2">
          <span className="text-xs font-medium text-emerald-100">{selectedKeys.size} selected</span>
          <button
            type="button"
            disabled={bulkBusy}
            onClick={() => onBulkAction("publish")}
            className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-50 hover:bg-emerald-600/40 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={bulkBusy}
            onClick={() => onBulkAction("draft")}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/85 hover:bg-white/10 disabled:opacity-50"
          >
            Move to draft
          </button>
          <button
            type="button"
            disabled={bulkBusy}
            onClick={() => onBulkAction("delete")}
            className="rounded-full border border-rose-500/35 px-3 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-950/40 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
        <table className="min-w-full text-left text-sm text-white/90">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  disabled={loading || visibleKeys.length === 0 || bulkBusy}
                  onChange={() => onToggleSelectAll(visibleKeys)}
                  aria-label="Select all visible posts"
                />
              </th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Lang</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Publish date</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-white/50">
                  Loading posts…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-white/50">
                  No posts match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const key = postKey(p);
                const active = selectedKey === key;
                const checked = selectedKeys.has(key);
                const publicPath =
                  p.status === "published"
                    ? p.locale === "es"
                      ? `/es/resources/blogs/${p.slug}`
                      : `/resources/blogs/${p.slug}`
                    : null;
                return (
                  <tr
                    key={key}
                    className={`border-t border-white/10 ${active ? "bg-emerald-950/25" : "hover:bg-white/5"}`}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={bulkBusy}
                        onChange={() => onToggleSelect(key)}
                        aria-label={`Select ${p.title}`}
                      />
                    </td>
                    <td className="max-w-[220px] px-3 py-2">
                      <button
                        type="button"
                        onClick={() => onSelectPost(key)}
                        className="text-left font-medium text-emerald-50 hover:underline"
                      >
                        {p.title}
                      </button>
                      <div className="font-mono text-xs text-white/45">{p.slug}</div>
                    </td>
                    <td className="px-3 py-2 uppercase text-xs">{p.locale}</td>
                    <td className="px-3 py-2 capitalize">{p.category}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.status === "published"
                            ? "bg-emerald-600/30 text-emerald-100"
                            : "bg-white/10 text-white/65"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-mono text-white/60">
                      {p.publishedAt?.slice(0, 10) ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-mono text-white/60">
                      {p.updatedAt?.slice(0, 10) ?? "—"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectPost(key)}
                        className="text-xs font-semibold text-emerald-300 underline"
                      >
                        Edit
                      </button>
                      {publicPath ? (
                        <>
                          <span className="mx-1 text-white/30">·</span>
                          <a
                            href={publicPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-white/70 underline hover:text-white"
                          >
                            View
                          </a>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
