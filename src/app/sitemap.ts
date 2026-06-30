import type { MetadataRoute } from "next";
import { blogPublicPath } from "@/lib/blog-locale";
import { listAllBlogSlugsForSitemap } from "@/lib/blog-service";
import { listPublishedListings } from "@/lib/listings/public-listings-service";
import { portfolioItems } from "@/data/portfolio";
import { legalPages } from "@/data/resources";
import { LEGACY_CALCULATOR_CATALOG } from "@/lib/calculators/types";
import { ES_MARKETING_SITEMAP_PATHS } from "@/lib/locale-metadata";
import { allLocationSitemapPaths } from "@/lib/texas-location-seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://listqik.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogEntries = await listAllBlogSlugsForSitemap();

  const staticRoutes = [
    "",
    "/about",
    "/pricing",
    "/full-service",
    "/start-now",
    "/listings",
    "/service-area",
    "/service-area/texas/dfw",
    "/service-area/texas/austin",
    "/service-area/texas/san-antonio",
    "/service-area/texas/houston",
    "/resources",
    "/resources/blogs",
    "/resources/videos",
    "/listqik-university",
    "/upgrades",
    "/investors",
    "/buyers",
  ];

  const calculatorRoutes = [
    "/investors",
    "/calculators/legacy",
    ...LEGACY_CALCULATOR_CATALOG.map((c) => `/calculators/legacy/${c.slug}`),
  ];

  const publishedListings = await listPublishedListings();
  const listingRoutes = publishedListings.map((l) => `/listings/${l.slug}`);
  const blogRoutes = blogEntries.map((entry) => blogPublicPath(entry.slug, entry.locale));
  const legalRoutes = legalPages.map((p) => `/resources/legal/${p.slug}`);
  const portfolioRoutes = Array.from(new Set(portfolioItems.map((p) => p.category))).map(
    (category) => `/portfolio/${category}`,
  );
  const locationRoutes = allLocationSitemapPaths();

  return [
    ...staticRoutes,
    ...calculatorRoutes,
    ...ES_MARKETING_SITEMAP_PATHS,
    ...listingRoutes,
    ...blogRoutes,
    ...legalRoutes,
    ...portfolioRoutes,
    ...locationRoutes,
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/listings/") ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/listings"
          ? 0.9
          : path === "/service-area" || path === "/es/service-area"
            ? 0.75
            : path === "/service-area/texas/dfw" ||
                path === "/es/service-area/texas/dfw" ||
                path === "/service-area/texas/austin" ||
                path === "/es/service-area/texas/austin" ||
                path === "/service-area/texas/san-antonio" ||
                path === "/es/service-area/texas/san-antonio" ||
                path === "/service-area/texas/houston" ||
                path === "/es/service-area/texas/houston"
              ? 0.7
              : /\/service-area\/texas\/[^/]+-county$/.test(path) ||
                  /\/es\/service-area\/texas\/[^/]+-county$/.test(path)
                ? 0.65
                : path.includes("/service-area/texas/")
                  ? 0.55
                  : 0.7,
  }));
}
