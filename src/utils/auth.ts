import api from './api';
import { isAuth0Configured } from '@/lib/auth0';

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
 * Sets auth cookies for middleware verification.
 */
export const setAuthCookies = (token?: string) => {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }
  document.cookie = `user_exists=true; path=/; max-age=2592000; SameSite=Lax`;
};

/**
 * Handles social login for Google, LinkedIn, Facebook, or Instagram.
 * If Auth0 is configured with credentials, redirects to Auth0.
 * Otherwise, completes social login via the backend API / mock fallback.
 */
export const handleSocialLogin = async (
  provider: string,
  options?: {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
  }
) => {
  const providerLower = (provider || 'google').toLowerCase();

  // If Auth0 credentials are provided, use Auth0 universal login
  if (isAuth0Configured) {
    const connection = AUTH0_CONNECTIONS[providerLower];
    let loginUrl = '/auth/login?returnTo=/profile';
    if (connection) {
      loginUrl += `&connection=${encodeURIComponent(connection)}`;
    }
    window.location.href = loginUrl;
    return;
  }

  // Otherwise authenticate using backend social login
  try {
    const providerCapitalized = provider.charAt(0).toUpperCase() + provider.slice(1);
    const mockEmail = `${providerLower}.user@envirojunction.com`;
    const mockName = `${providerCapitalized} Member`;

    const payload: SocialAuthPayload = {
      email: mockEmail,
      name: mockName,
      provider: providerLower,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };

    const data = await socialLogin(payload);
    const successMsg = `Signed in with ${providerCapitalized} successfully!`;
    if (options?.onSuccess) {
      options.onSuccess(successMsg);
    }
    setTimeout(() => {
      window.location.href = '/profile';
    }, 500);
  } catch (error: any) {
    console.error('Social login error:', error);
    const errMsg = error.formattedMessage || `Failed to sign in with ${provider}. Please try again.`;
    if (options?.onError) {
      options.onError(errMsg);
    }
  }
};

/**
 * Sends social signup request to /auth/social-signup or fallback route.
 * Stores received JWT token and user info in localStorage and cookies upon success.
 */
export const socialSignUp = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/social-signup', payload);
  const { token, user } = response.data;

  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setAuthCookies(token);
  }

  return response.data;
};

/**
 * Sends social login request to /auth/social-login or fallback route.
 * Stores received JWT token and user info in localStorage and cookies upon success.
 */
export const socialLogin = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/social-login', payload);
  const { token, user } = response.data;

  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setAuthCookies(token);
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
 * Clears local storage, cookies, and redirects the user to /signin.
 */
export const handleLogout = () => {
  if (typeof window !== 'undefined') {
    // Clear all local browser storage to ensure a clean state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    sessionStorage.clear();

    // Expire custom cookies with path /
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
    document.cookie = 'user_exists=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';

    // If Auth0 is configured, logout from Auth0
    if (isAuth0Configured) {
      window.location.href = '/auth/logout?returnTo=/signin';
    } else {
      window.location.href = '/signin';
    }
  }
};

