import { NextResponse } from "next/server";
import { isLocale, localeCookie, locales, matchLocale } from "@/lib/i18n";

/**
 * @param {import('next/server').NextRequest} request
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    if (isLocale(locale)) {
      response.cookies.set(localeCookie, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookie)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip locale handling for APIs, static assets, the admin UI and Sanity Studio.
  matcher: [
    "/((?!(?:api|admin|studio)(?:/|$)|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
