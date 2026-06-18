import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { LISTQIK_LOGO_ALT, LISTQIK_LOGO_PATH } from "@/lib/brand-assets";

import { GOOGLE_ADS_TAG_ID } from "@/lib/google-ads-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://listqik.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ListQik.com",
    template: "%s · ListQik.com",
  },
  description:
    "ListQik.com helps Texas home sellers list through a licensed brokerage, keep more equity, and access broker-backed support from Resolution Realty Group.",
  applicationName: "ListQik.com",
  authors: [{ name: "Resolution Realty Group" }],
  creator: "Resolution Realty Group",
  publisher: "Resolution Realty Group",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: LISTQIK_LOGO_PATH, type: "image/webp" }],
    apple: LISTQIK_LOGO_PATH,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ListQik.com",
    title: "ListQik.com",
    description:
      "Texas listing platform with licensed brokerage support, clear compliance guidance, and marketing workflow tools.",
    images: [{ url: LISTQIK_LOGO_PATH, alt: LISTQIK_LOGO_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListQik.com",
    description:
      "Texas listing platform with licensed brokerage support and guided listing workflows.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-0 flex flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Skip to content
        </a>
        <AuthSessionProvider>
          <main id="content" className="flex-1">
            {children}
          </main>
        </AuthSessionProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_TAG_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
