import { auth0, isAuth0Configured } from "@/lib/auth0";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that do NOT require an authenticated session.
 * All other routes will redirect to /signin when no session is present.
 */
const PUBLIC_PATHS = ["/signup", "/signin", "/forgot-password"];

/**
 * Returns true when the request path starts with one of the given prefixes or matches a public asset.
 */
function isPublicPath(pathname: string): boolean {
  // Auth and API routes
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/")) return true;

  // Allow static images and media assets
  if (/\.(jpg|jpeg|png|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(pathname)) return true;

  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Middleware:
 *  1. If user lands on "/" -> always redirect to "/signin".
 *  2. If user is logged out -> protect all non-public routes and redirect to "/signin".
 *  3. Handle Auth0 session refreshes if configured.
 */
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // If Auth0 is not configured and a request hits an Auth0-specific route, handle gracefully
    if (!isAuth0Configured && pathname.startsWith("/auth/")) {
      if (pathname === "/auth/login" || pathname === "/auth/logout" || pathname === "/auth/callback") {
        const signinUrl = request.nextUrl.clone();
        signinUrl.pathname = "/signin";
        signinUrl.search = "error=sso_not_configured";
        return NextResponse.redirect(signinUrl);
      }

      if (!pathname.startsWith("/auth/signup") && !pathname.startsWith("/auth/social-") && !pathname.startsWith("/auth/sso-callback")) {
        return NextResponse.json(
          {
            error: "Auth0 is not configured.",
            message: "Please define AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, and AUTH0_SECRET in .env.local",
          },
          { status: 503 }
        );
      }
    }

    // Run Auth0's own middleware (handles /auth/* & session cookie) when configured.
    let auth0Response = NextResponse.next();
    if (isAuth0Configured) {
      try {
        auth0Response = await auth0.middleware(request);
      } catch (e) {
        console.error("Auth0 middleware error:", e);
      }
    }

    // Public routes — no session required.
    if (isPublicPath(pathname)) {
      return auth0Response;
    }

    // Check for an active session or custom token.
    let session = null;
    if (isAuth0Configured) {
      try {
        session = await auth0.getSession(request);
      } catch (e) {
        console.error("Auth0 getSession error:", e);
      }
    }

    const tokenCookie = request.cookies.get("token")?.value;
    const userExistsCookie = request.cookies.get("user_exists")?.value;
    const hasCustomToken = Boolean(
      (tokenCookie && tokenCookie.trim() !== "" && tokenCookie !== "undefined" && tokenCookie !== "null") ||
      (userExistsCookie && userExistsCookie === "true")
    );

    const isAuthenticated = Boolean(session || hasCustomToken);

    // If user is logged out (including landing on root "/" while logged out), redirect to /signin
    if (!isAuthenticated) {
      const signinUrl = request.nextUrl.clone();
      signinUrl.pathname = "/signin";
      signinUrl.search = "";
      return NextResponse.redirect(signinUrl);
    }

    return auth0Response;
  } catch (err) {
    console.error("Middleware unhandled error:", err);
    return NextResponse.next();
  }
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
