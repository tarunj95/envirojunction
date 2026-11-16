import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getBackendApiBaseUrl } from './backend';

// Create an Axios instance pointing to backend base URL
const getBaseUrl = () => {
  return getBackendApiBaseUrl();
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the current access token from localStorage, cookies, or the /auth/me session endpoint.
 * Returns null when the user is unauthenticated.
 */
async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // 1. Try custom JWT token from localStorage
  const localToken = localStorage.getItem('token');
  if (localToken && localToken.trim() !== '' && localToken !== 'undefined' && localToken !== 'null') {
    return localToken;
  }

  // 2. Try token cookie
  try {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match && match[1] && match[1] !== 'undefined' && match[1] !== 'null') {
      return decodeURIComponent(match[1]);
    }
  } catch (_) {}

  // 3. Try Auth0 session token with an explicit 1500ms timeout so it never blocks requests
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch('/auth/me', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const session = await res.json();
    return session?.token?.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Request Interceptor — Attaches Authorization Bearer token, normalizes paths, and logs outgoing request
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Normalize endpoint paths so both /api/... and standard backend paths succeed
    if (config.url) {
      if (config.url.startsWith('/api/auth/')) {
        config.url = config.url.replace(/^\/api\/auth\//, '/auth/');
      } else if (config.url.startsWith('/api/users')) {
        config.url = config.url.replace(/^\/api\/users/, '/users');
      } else if (config.url.startsWith('/api/jobs')) {
        config.url = config.url.replace(/^\/api\/jobs/, '/jobs');
      } else if (config.url.startsWith('/api/tenders')) {
        config.url = config.url.replace(/^\/api\/tenders/, '/tenders');
      } else if (config.url.startsWith('/api/news')) {
        config.url = config.url.replace(/^\/api\/news/, '/news');
      } else if (config.url.startsWith('/api-backend/')) {
        config.url = config.url.replace(/^\/api-backend\//, '/');
      }
    }

    // Skip attempting to read Auth0/JWT tokens for unauthenticated public routes
    const isPublicAuthRoute =
      config.url?.startsWith('/auth/login') ||
      config.url?.startsWith('/auth/signup') ||
      config.url?.startsWith('/auth/social-login') ||
      config.url?.startsWith('/auth/social-signup') ||
      config.url?.startsWith('/auth/forgot-password');

    if (!isPublicAuthRoute) {
      const accessToken = await getAccessToken();
      if (accessToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor — Logs responses, standardizes error responses, and handles 401 Unauthorized globally
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Axios Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<any>) => {
    let formattedMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.data) {
      const data = error.response.data;
      // Handle NestJS validation errors: message can be string or string[]
      if (Array.isArray(data.message)) {
        formattedMessage = data.message.join(', ');
      } else if (typeof data.message === 'string') {
        formattedMessage = data.message;
      } else if (typeof data.error === 'string') {
        formattedMessage = data.error;
      }
    } else if (error.message) {
      formattedMessage = error.message;
    }

    // Attach human-readable formatted message onto error object
    (error as any).formattedMessage = formattedMessage;

    console.error(`[Axios Response Error ${error.response?.status || 'UNKNOWN'}]`, formattedMessage);

    // Global handling for 401 Unauthorized errors
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname === '/signin' ||
        pathname === '/signup' ||
        pathname === '/forgot-password' ||
        pathname.startsWith('/signin/') ||
        pathname.startsWith('/signup/');

      if (!isAuthPage) {
        // Clear invalid credentials and redirect to /signin
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
        document.cookie = 'user_exists=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
