import { API_CONFIG, STORAGE_KEYS } from '@/lib/constants';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.authToken);
}

async function request<T>(endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers as object) };

  if (!options.skipAuth) {
    const token = getToken();
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    let message: any;

    if (typeof err === 'string') {
      message = err;
    } else if (err.error?.details) {
      message = err.error.details;
    } else if (err.error?.message && err.error?.message !== 'Internal server error') {
      message = err.error.message;
    } else if (err.detail) {
      message = err.detail;
    } else if (err.non_field_errors) {
      message = Array.isArray(err.non_field_errors) ? err.non_field_errors[0] : err.non_field_errors;
    } else if (typeof err === 'object' && Object.keys(err).length > 0) {
      // Look for any key that might have an ErrorDetail list
      const firstKey = Object.keys(err)[0];
      const val = err[firstKey];
      const valStr = Array.isArray(val) ? val[0] : val;
      message = (firstKey === 'error' || firstKey === 'message') ? valStr : `${firstKey}: ${valStr}`;
    } else {
      message = res.statusText || `Error ${res.status}`;
    }

    // Clean up DRF ErrorDetail string leakage recursively if it occurs
    let finalMessage = typeof message === 'object' ? JSON.stringify(message) : String(message);

    // Multiple passes to catch nested identifiers
    while (finalMessage.includes('ErrorDetail(')) {
      const match = finalMessage.match(/string=['"]([^'"]+)['"]/);
      if (match) {
        finalMessage = match[1];
      } else {
        break; // Guard against infinite loop
      }
    }

    throw new Error(finalMessage);
  }
  const data = await res.json();
  if (data && typeof data === 'object' && data.success === true && 'data' in data) {
    return data.data;
  }
  return data;
}

export const apiService = {
  get: <T>(endpoint: string, options?: any) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, body?: unknown, options?: any) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...options }),
  postUnauthenticated: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined, skipAuth: true }),
  patch: <T>(endpoint: string, body?: unknown, options?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, ...options }),
  delete: <T>(endpoint: string, options?: any) => request<T>(endpoint, { method: 'DELETE', ...options }),
};
