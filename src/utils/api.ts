import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance
// On client side (browser), use relative baseURL to proxy requests through Next.js API routes and avoid CORS errors.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://52.64.114.139:3000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the current access token from localStorage or the /auth/me session endpoint.
 * Returns null when the user is unauthenticated.
 */
async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // 1. Try custom JWT token from localStorage
  const localToken = localStorage.getItem('token');
  if (localToken) return localToken;

  // 2. Try Auth0 session token
  try {
    const res = await fetch('/auth/me');
    if (!res.ok) return null;
    const session = await res.json();
    return session?.token?.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Request Interceptor — Attaches Authorization Bearer token and logs outgoing request
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
 * Response Interceptor — Logs responses and standardizes error responses (including 400 Bad Request arrays)
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
      // Optional token cleanup or redirect handling if required
    }

    return Promise.reject(error);
  }
);

export default api;
