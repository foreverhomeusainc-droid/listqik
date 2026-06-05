import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { HOME_LOCALE_COOKIE_KEY } from "@/i18n/home-locale";

function redirectLangEsToNamespace(req: NextRequest): NextResponse | null {
  const { pathname, searchParams } = req.nextUrl;
  if (searchParams.get("lang") !== "es") return null;
  if (pathname === "/es" || pathname.startsWith("/es/")) return null;

  const url = req.nextUrl.clone();
  url.searchParams.delete("lang");
  url.pathname = pathname === "/" ? "/es" : `/es${pathname}`;
  return NextResponse.redirect(url, 308);
}

function redirectShorthandServiceAreaPaths(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const es = pathname.startsWith("/es/");
  const base = es ? pathname.slice(3) : pathname;
  const prefix = es ? "/es" : "";

  const countyMatch = base.match(/^\/service-area\/([^/]+-county)$/);
  if (countyMatch?.[1] && countyMatch[1] !== "texas") {
    const url = req.nextUrl.clone();
    url.pathname = `${prefix}/service-area/texas/${countyMatch[1]}`;
    return NextResponse.redirect(url, 308);
  }

  const cityMatch = base.match(/^\/service-area\/([^/]+-county)\/([^/]+)$/);
  if (cityMatch?.[1] && cityMatch[2]) {
    const url = req.nextUrl.clone();
    url.pathname = `${prefix}/service-area/texas/${cityMatch[1]}/${cityMatch[2]}`;
    return NextResponse.redirect(url, 308);
  }

  return null;
}

export default withAuth(
  function middleware(req) {
    const shorthandRedirect = redirectShorthandServiceAreaPaths(req);
    if (shorthandRedirect) return shorthandRedirect;

    const langRedirect = redirectLangEsToNamespace(req);
    if (langRedirect) return langRedirect;

    const { pathname } = req.nextUrl;

    if (pathname === "/es" || pathname.startsWith("/es/")) {
      const res = NextResponse.next();
      res.cookies.set(HOME_LOCALE_COOKIE_KEY, "es", {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
      return res;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const needsAuth =
          pathname === "/dashboard" ||
          pathname.startsWith("/dashboard/") ||
          pathname.startsWith("/api/dashboard/");
        if (!needsAuth) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/dashboard/:path*",
    "/api/dashboard/:path*",
    "/es",
    "/es/:path*",
  ],
};
