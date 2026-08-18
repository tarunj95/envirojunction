import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Shared Auth0 client instance configured from environment variables.
 * Used by the API route handler and server components.
 */
export const auth0 = new Auth0Client();
