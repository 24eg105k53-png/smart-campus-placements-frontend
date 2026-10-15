export function getApiBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://smart-campus-placements-backend-1y88.onrender.com';
  return envUrl.trim().replace(/\/+$/, '');
}

export function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  const base = getApiBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Check if base ends with /api/v1 or /api
  const baseHasApiV1 = /\/api\/v1\/?$/i.test(base);
  const baseHasApi = /\/api\/?$/i.test(base) && !baseHasApiV1;

  if (path.startsWith('/api/v1/')) {
    if (baseHasApiV1) {
      return `${base}${path.substring(7)}`; // strip /api/v1 from path to avoid duplicate
    }
    if (baseHasApi) {
      return `${base.replace(/\/api$/, '')}${path}`;
    }
    return `${base}${path}`;
  }

  if (path.startsWith('/api/')) {
    if (baseHasApiV1) {
      return `${base}${path.substring(4)}`; // strip /api from path
    }
    if (baseHasApi) {
      return `${base.replace(/\/api$/, '')}/api/v1${path.substring(4)}`;
    }
    return `${base}/api/v1${path.substring(4)}`;
  }

  // Handle health endpoints directly
  if (path === '/health' || path === '/api/v1/health') {
    const rootBase = base.replace(/\/api(\/v1)?$/i, '');
    return `${rootBase}/api/v1/health`;
  }

  // Endpoint does not have /api prefix (e.g. /auth/login, /jobs, /student/profile, /tpo/dashboard-stats)
  if (baseHasApiV1) {
    return `${base}${path}`;
  }
  if (baseHasApi) {
    return `${base}/v1${path}`;
  }

  // Clean base without /api or /v1
  return `${base}/api/v1${path}`;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = buildApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Token expired or invalid
        removeAuthToken();
      }
    }

    if (!res.ok) {
      let errorData: any = {};
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { message: res.statusText || `Request failed with status ${res.status}` };
      }

      let message = errorData.message || 'API request failed';
      if (Array.isArray(errorData.details) && errorData.details.length > 0) {
        message = errorData.details.join(', ');
      }

      const error: any = new Error(message);
      error.status = res.status;
      error.details = errorData.details || [];
      throw error;
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message?.includes('fetch')) {
      const networkError: any = new Error(
        'Unable to connect to the backend server. The backend on Render may be waking up from idle (which can take 30-60 seconds on free tier). Please wait a moment and try again.'
      );
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}
