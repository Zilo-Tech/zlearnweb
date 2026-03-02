import { API_CONFIG, STORAGE_KEYS } from '@/lib/constants';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (token && process.env.NODE_ENV === 'development') {
    console.log('🔑 Token retrieved from localStorage:', token.substring(0, 20) + '...');
  }
  return token;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers as object) };
  const token = getToken();
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  } else if (endpoint.includes('/api/') && !endpoint.includes('/auth/')) {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn(`API call to ${endpoint} made without authentication token`);
    }
  }
  
  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    // For 404 endpoints that don't exist yet, return empty response instead of erroring
    if (res.status === 404) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Endpoint not found: ${endpoint} (404)`);
      }
      // Try to determine appropriate empty response based on endpoint
      if (endpoint.includes('/api/')) {
        return (Array.isArray([]) ? [] : {}) as T;
      }
    }
    
    // For 401, clear token and provide helpful error
    if (res.status === 401) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Unauthorized access to ${endpoint}. Token may be invalid or expired.`);
      }
      if (typeof window !== 'undefined') {
        const currentToken = localStorage.getItem(STORAGE_KEYS.authToken);
        if (currentToken) {
          localStorage.removeItem(STORAGE_KEYS.authToken);
        }
      }
      throw new Error('Unauthorized. Please log in again.');
    }
    
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || res.statusText);
  }
  return res.json();
}

export const apiService = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
