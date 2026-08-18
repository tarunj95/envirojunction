import api from './api';

export interface SocialAuthPayload {
  email: string;
  name: string;
  provider: 'google' | 'facebook' | 'linkedin' | 'instagram' | 'auth0' | string;
  providerId?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
  status?: string;
  [key: string]: any;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserProfile;
}

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
export const handleSocialLogin = (provider?: string) => {
  const connection = provider ? AUTH0_CONNECTIONS[provider.toLowerCase()] : undefined;

  let loginUrl = '/auth/login?returnTo=/profile';
  if (connection) {
    loginUrl += `&connection=${encodeURIComponent(connection)}`;
  }

  window.location.href = loginUrl;
};

/**
 * Sends social signup request to POST /api/auth/social-signup using Axios api client.
 * Stores received JWT token and user info in localStorage upon success.
 */
export const socialSignUp = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/social-signup', payload);
  const { token, user } = response.data;

  if (token && typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
  if (user && typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return response.data;
};

/**
 * Sends social login request to POST /api/auth/social-login using Axios api client.
 * Stores received JWT token and user info in localStorage upon success.
 */
export const socialLogin = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/social-login', payload);
  const { token, user } = response.data;

  if (token && typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
  if (user && typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return response.data;
};

/**
 * Helper to sync an authenticated Auth0 user profile with the backend social signup endpoint.
 */
export const syncSocialUserWithBackend = async (auth0User: any): Promise<AuthResponse | null> => {
  if (!auth0User || !auth0User.email) return null;

  let provider = 'auth0';
  let providerId = auth0User.sub || '';

  if (auth0User.sub) {
    const subParts = auth0User.sub.split('|');
    if (subParts.length > 1) {
      provider = subParts[0];
      providerId = subParts[1];
    }
  }

  const payload: SocialAuthPayload = {
    email: auth0User.email,
    name: auth0User.name || auth0User.nickname || auth0User.email.split('@')[0],
    provider,
    providerId,
    avatar: auth0User.picture,
  };

  try {
    return await socialSignUp(payload);
  } catch (error) {
    console.error('Failed to sync Auth0 user with backend social signup:', error);
    throw error;
  }
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

  // Clear custom cookies
  document.cookie = 'token=; path=/; max-age=0';
  document.cookie = 'user_exists=; path=/; max-age=0';

  // Redirect to Auth0 logout to clear server-side session
  window.location.href = '/auth/logout';
};

