import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { parseBlogLocale } from "@/lib/blog-locale";
import {
  bulkDeleteBlogPosts,
  bulkSetBlogStatus,
  type BlogPostRef,
} from "@/lib/blog-service";

function parseItems(raw: unknown): BlogPostRef[] {
  if (!Array.isArray(raw)) return [];
  const items: BlogPostRef[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    const slug = typeof o.slug === "string" ? o.slug.trim().toLowerCase() : "";
    const locale = parseBlogLocale(o.locale);
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
    items.push({ slug, locale });
  }
  return items;
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if ("error" in auth && auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = typeof o.action === "string" ? o.action.trim() : "";
  const items = parseItems(o.items);

  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "No posts selected." }, { status: 400 });
  }

  const email = auth.session?.user?.email ?? null;

  try {
    if (action === "publish") {
      const count = await bulkSetBlogStatus(items, "published", email);
      return NextResponse.json({ ok: true, count, action });
    }
    if (action === "draft") {
      const count = await bulkSetBlogStatus(items, "draft", email);
      return NextResponse.json({ ok: true, count, action });
    }
    if (action === "delete") {
      const count = await bulkDeleteBlogPosts(items);
      return NextResponse.json({ ok: true, count, action });
    }
    return NextResponse.json({ ok: false, error: "Unknown bulk action." }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bulk action failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
