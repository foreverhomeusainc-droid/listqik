import type { Metadata } from "next";
import { HomePageShell } from "@/components/home/home-page-shell";
import { getHomepageCopy } from "@/i18n/homepage-copy";
import { getRequestHomeLocale, homeOpenGraphLocale } from "@/lib/site-locale-server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getRequestHomeLocale(params.lang);
  const copy = getHomepageCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      locale: homeOpenGraphLocale(locale),
    },
  };
}

export default function HomePage() {
  return <HomePageShell />;
}
