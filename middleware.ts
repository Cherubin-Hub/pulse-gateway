import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("pulse_gateway_user")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/login";
  const isProtectedHub = pathname.startsWith("/portal");

  // 1. If already logged in and visiting /login, bounce to /portal
  if (sessionCookie && isAuthRoute) {
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = "/portal";
    return NextResponse.redirect(portalUrl);
  }

  // 2. If not logged in and visiting /portal, bounce to /login
  if (!sessionCookie && isProtectedHub) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
