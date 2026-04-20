/**
 * Auth0 connection names for each social provider.
 * These must match the connection names configured in your Auth0 dashboard
 * under Authentication > Social Connections.
 */
const AUTH0_CONNECTIONS: Record<string, string> = {
  google: 'google-oauth2',
  linkedin: 'linkedin',
  facebook: 'facebook',
  instagram: 'instagram',
};

/**
 * Redirects the user to Auth0's Universal Login for the specified social provider.
 * Auth0 handles the full OAuth flow (PKCE, token exchange, session) server-side.
 *
 * @param provider - One of: 'google' | 'linkedin' | 'facebook' | 'instagram'
 */
export const handleSocialLogin = (provider: string) => {
  const connection = AUTH0_CONNECTIONS[provider];

  if (!connection) {
    console.error(`[auth] Unknown provider: "${provider}". Add it to AUTH0_CONNECTIONS.`);
    return;
  }

  // /auth/login is handled by Auth0's Next.js SDK route handler at:
  // src/app/auth/[auth0]/route.ts
  // The `connection` param tells Auth0 which social IdP to use directly,
  // skipping the Universal Login screen.
  const loginUrl = `/auth/login?connection=${encodeURIComponent(connection)}`;
  window.location.href = loginUrl;
};

/**
 * Redirects the user to Auth0's logout route.
 * This will clear the local Next.js session and redirect to the Auth0 logout URL
 * to clear the Auth0 session, then return to the configured returnTo URL (usually /).
 */
export const handleLogout = () => {
  // Clear all local browser storage to ensure a clean state
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to Auth0 logout to clear server-side session
  window.location.href = '/auth/logout';
};
