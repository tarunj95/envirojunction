import api from './api';
import { isAuth0Configured, isAuth0ClientConfigured } from '@/lib/auth0';
import { triggerGoogleOAuth } from './google-auth';

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
 * These match the connection names configured in your Auth0 dashboard
 * under Authentication > Social Connections.
 */
export const AUTH0_CONNECTIONS: Record<string, string> = {
  google: 'google-oauth2',
  linkedin: 'linkedin',
  facebook: 'facebook',
  instagram: 'instagram',
};

/**
 * Returns the direct Auth0 OAuth login URL for the specified provider.
 * When provider is omitted, opens Universal Login (SSO portal).
 */
export const getAuth0LoginUrl = (provider?: string, returnTo = '/auth/sso-callback'): string => {
  if (!provider) {
    return `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  }
  const providerLower = provider.toLowerCase();
  const connection = AUTH0_CONNECTIONS[providerLower] || providerLower;
  return `/auth/login?connection=${encodeURIComponent(connection)}&returnTo=${encodeURIComponent(returnTo)}`;
};

/**
 * Initiates direct browser redirect to Auth0 OAuth for the specified social provider.
 */
export const handleDirectOAuth = (provider?: string, returnTo = '/auth/sso-callback') => {
  if (typeof window !== 'undefined') {
    window.location.href = getAuth0LoginUrl(provider, returnTo);
  }
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

export interface HandleSocialLoginOptions {
  email?: string;
  name?: string;
  avatar?: string;
  isSignUp?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  forceDirectOAuth?: boolean;
}

/**
 * Handles social login/registration for Google, LinkedIn, Facebook, or Instagram via OAuth SSO.
 * If provider is Google and NEXT_PUBLIC_GOOGLE_CLIENT_ID is set, prompts with Google Identity Services.
 * Otherwise, initiates direct OAuth SSO via Auth0.
 */
export const handleSocialLogin = async (
  provider: string,
  options?: HandleSocialLoginOptions
) => {
  const providerLower = (provider || 'google').toLowerCase();

  if (options?.forceDirectOAuth) {
    handleDirectOAuth(providerLower, '/auth/sso-callback');
    return;
  }

  // 1. Google OAuth Authentication flow via Google Identity Services (if Client ID configured)
  if (providerLower === 'google') {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

    if (googleClientId && googleClientId !== '' && !googleClientId.includes('your_google')) {
      try {
        const googleProfile = await triggerGoogleOAuth(googleClientId);

        const payload: SocialAuthPayload = {
          email: googleProfile.email,
          name: googleProfile.name,
          provider: 'google',
          providerId: googleProfile.sub,
          avatar: googleProfile.avatar,
        };

        const isSignUp = options?.isSignUp ?? false;
        const data = isSignUp ? await socialSignUp(payload) : await socialLogin(payload);
        const action = isSignUp ? 'Registered' : 'Signed in';
        const successMsg = `${action} with Google as ${googleProfile.email} successfully!`;

        if (options?.onSuccess) {
          options.onSuccess(successMsg);
        }

        setTimeout(() => {
          window.location.href = '/profile';
        }, 500);

        return data;
      } catch (error: any) {
        console.error('Google OAuth Error:', error);
        const errMsg = error.message || 'Google sign-in was cancelled or failed.';
        if (options?.onError) {
          options.onError(errMsg);
        }
        throw error;
      }
    }
  }

  // 2. Direct OAuth SSO flow for social providers (Google, LinkedIn, Facebook, Instagram)
  handleDirectOAuth(providerLower, '/auth/sso-callback');
};

/**
 * Sends social signup request to /auth/social-signup or fallback route.
 * Stores received JWT token and user info in localStorage and cookies upon success.
 */
export const socialSignUp = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/social-signup', payload);
  const { token, user } = response.data;

  const fullUser = user
    ? {
        ...user,
        avatar: user.avatar || payload.avatar,
        picture: user.picture || payload.avatar,
      }
    : user;

  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    if (fullUser) localStorage.setItem('user', JSON.stringify(fullUser));
    setAuthCookies(token);
  }

  return { ...response.data, user: fullUser };
};

/**
 * Sends social login request to /auth/social-login or fallback route.
 * Stores received JWT token and user info in localStorage and cookies upon success.
 */
export const socialLogin = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/social-login', payload);
  const { token, user } = response.data;

  const fullUser = user
    ? {
        ...user,
        avatar: user.avatar || payload.avatar,
        picture: user.picture || payload.avatar,
      }
    : user;

  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    if (fullUser) localStorage.setItem('user', JSON.stringify(fullUser));
    setAuthCookies(token);
  }

  return { ...response.data, user: fullUser };
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
    if (isAuth0ClientConfigured()) {
      window.location.href = '/auth/logout?returnTo=/signin';
    } else {
      window.location.href = '/signin';
    }
  }
};

