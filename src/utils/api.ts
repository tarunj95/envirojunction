import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the current Auth0 access token from the /auth/me session endpoint.
 * Returns null when the user is unauthenticated.
 */
async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // 1. Try custom token from localStorage (set by /auth/login)
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

// Request interceptor — attaches Bearer token and logs the outgoing request
api.interceptors.request.use(
  async (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);

    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor — logs responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
