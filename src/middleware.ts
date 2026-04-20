import { auth0 } from "@/lib/auth0";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that do NOT require an authenticated session.
 * All other routes will redirect to /signin when no session is present.
 */
const PUBLIC_PATHS = ["/signup", "/signin", "/forgot-password"];

/**
 * Returns true when the request path starts with one of the given prefixes.
 */
function isPublicPath(pathname: string): boolean {
  // Auth0 SDK handles its own /auth/* routes — always allow them through.
  if (pathname.startsWith("/auth/")) return true;

  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Auth0 middleware — runs on every request to:
 *  1. Let the Auth0 SDK refresh the session rolling window.
 *  2. Redirect unauthenticated users to /signin for protected routes.
 *
 * The matcher below excludes static assets and Next.js internals.
 */
export async function middleware(request: NextRequest) {
  // Always run Auth0's own middleware first (handles /auth/* & session cookie).
  const auth0Response = await auth0.middleware(request);

  const { pathname } = request.nextUrl;

  // Public routes — no session required.
  if (isPublicPath(pathname)) {
    return auth0Response;
  }

  // Check for an active Auth0 session.
  const session = await auth0.getSession(request, auth0Response);

  if (!session) {
    // No session — redirect to /signin, preserving the intended destination.
    const signinUrl = request.nextUrl.clone();
    signinUrl.pathname = "/signin";
    signinUrl.search = "";
    return NextResponse.redirect(signinUrl);
  }

  return auth0Response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
