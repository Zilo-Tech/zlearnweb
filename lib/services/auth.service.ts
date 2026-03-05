import { apiService } from './api.service';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User, LoginCredentials, RegisterData } from '@/lib/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const res = await apiService.postUnauthenticated<any>('/api/auth/login/', credentials);

    // Handle wrapped response structure: { success: true, data: { token, user, ... } }
    const data = res.data || res;
    const token = data.access || data.token || '';
    const user = data.user || (data.id ? data : null);

    if (token && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      if (data.refresh || data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh || data.refresh_token);
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      }
    }
    return { user: user as User, token };
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout/');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
  },

  async getProfile(): Promise<User | null> {
    const data = await apiService.get<User>('/api/auth/me/');
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data));
    }
    return data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const res = await apiService.postUnauthenticated<any>('/api/auth/register/', data);
    const result = res.data || res;
    const token = result.access || result.token || '';
    const user = result.user || (result.id ? result : null);

    if (token && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      }
    }
    return { user: user as User, token };
  },

  async verifyEmail(token: string): Promise<unknown> {
    return apiService.post('/api/auth/verify-email/', { token });
  },

  async completeOnboarding(payload: Record<string, unknown>): Promise<unknown> {
    return apiService.post('/api/auth/complete-onboarding/', payload);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/api/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
