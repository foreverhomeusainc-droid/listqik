import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { HOME_LOCALE_COOKIE_KEY } from "@/i18n/home-locale";

export default withAuth(
  function middleware(req) {
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
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*", "/es", "/es/:path*"],
};
