/**
 * Safely resolves the backend API base URL.
 * Replaces any outdated / dead IP (like 52.64.114.139) with the official production API URL.
 */
export function getBackendApiBaseUrl(): string {
  // If running in browser and on production domain, always use https://api.envirojunction.com
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('envirojunction.com')) {
      return 'https://api.envirojunction.com';
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (
    !envUrl ||
    envUrl.includes('52.64.114.139') ||
    envUrl.trim() === '' ||
    envUrl === 'undefined' ||
    envUrl === 'null'
  ) {
    return 'https://api.envirojunction.com';
  }

  return envUrl.replace(/\/+$/, '');
}
