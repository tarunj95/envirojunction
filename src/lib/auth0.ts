import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Checks whether all required Auth0 environment variables are present and non-empty.
 */
export const isAuth0Configured = Boolean(
  process.env.AUTH0_DOMAIN &&
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_SECRET &&
  (process.env.AUTH0_CLIENT_SECRET || process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY)
);

/**
 * Client-safe helper to detect if Auth0 is enabled in the environment.
 */
export const isAuth0ClientConfigured = (): boolean => {
  if (typeof window === 'undefined') return isAuth0Configured;
  return Boolean(
    process.env.NEXT_PUBLIC_AUTH0_ENABLED === 'true' ||
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  );
};

if (!isAuth0Configured && process.env.NODE_ENV !== "production") {
  console.warn(
    "[Auth0] Warning: Missing required Auth0 environment variables.\n" +
    "To enable Auth0 authentication, define the following in .env.local:\n" +
    "  - AUTH0_DOMAIN\n" +
    "  - AUTH0_CLIENT_ID\n" +
    "  - AUTH0_CLIENT_SECRET\n" +
    "  - AUTH0_SECRET (run `openssl rand -hex 32`)\n" +
    "  - APP_BASE_URL (defaults to http://localhost:9002)\n" +
    "Running with fallback configuration."
  );
}

/**
 * Safely resolves the application base URL for Auth0 redirects.
 * In production, defaults to 'https://www.envirojunction.com'.
 * In development, defaults to 'http://localhost:9002' (matching APP_BASE_URL).
 */
export const getAppBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return (process.env.APP_BASE_URL || 'https://www.envirojunction.com').replace(/\/+$/, '');
  }
  return (process.env.APP_BASE_URL || 'http://localhost:9002').replace(/\/+$/, '');
};

/**
 * Shared Auth0 client instance.
 * Uses fallback configuration when environment variables are not yet configured,
 * preventing server startup crashes.
 */
export const auth0 = new Auth0Client(
  isAuth0Configured
    ? {
        appBaseUrl: getAppBaseUrl(),
      }
    : {
        domain: "placeholder.auth0.com",
        clientId: "placeholder_client_id",
        clientSecret: "placeholder_client_secret",
        secret:
          process.env.AUTH0_SECRET ||
          "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        appBaseUrl: getAppBaseUrl(),
      }
);
