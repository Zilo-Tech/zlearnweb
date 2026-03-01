import { apiService } from './api.service';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User } from '@/lib/types';

export interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: User;
  token?: string;
}

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const data = await apiService.post<LoginResponse & { user?: User; access?: string }>('/api/auth/login/', credentials);
    const token = (data as { access?: string }).access || (data as { token?: string }).token || '';
    const user = (data as { user?: User }).user || (data as User);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      if ((data as { refresh?: string }).refresh) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, (data as { refresh: string }).refresh);
      }
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
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

  async register(data: { email: string; password: string; name?: string }): Promise<{ user: User; token: string }> {
    const res = await apiService.post<LoginResponse & { user?: User; access?: string }>('/api/auth/register/', data);
    const token = (res as { access?: string }).access || '';
    const user = (res as { user?: User }).user || (res as User);
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
