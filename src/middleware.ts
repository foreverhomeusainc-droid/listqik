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

export default withAuth(
  function middleware(req) {
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
