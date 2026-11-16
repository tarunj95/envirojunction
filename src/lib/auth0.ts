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
 * Shared Auth0 client instance.
 * Uses fallback configuration when environment variables are not yet configured,
 * preventing server startup crashes.
 */
export const auth0 = new Auth0Client(
  isAuth0Configured
    ? {}
    : {
        domain: "placeholder.auth0.com",
        clientId: "placeholder_client_id",
        clientSecret: "placeholder_client_secret",
        secret:
          process.env.AUTH0_SECRET ||
          "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        appBaseUrl:
          process.env.APP_BASE_URL ||
          process.env.AUTH0_BASE_URL ||
          "http://localhost:9002",
      }
);
