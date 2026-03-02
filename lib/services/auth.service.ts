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
    const response = await apiService.post<any>('/api/auth/login/', credentials);
    
    // Handle nested response structure: { success, data: { user, token, refresh_token } }
    const responseData = response?.data || response;
    const token = responseData?.token || responseData?.access || '';
    const user = responseData?.user || {};
    const refreshToken = responseData?.refresh_token || responseData?.refresh;
    
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.authToken, token);
        console.log('✅ Auth token saved to localStorage');
        console.log('🔑 Token preview:', token.substring(0, 30) + '...');
      } else {
        console.error('⚠️ No token received from login response');
        console.log('📦 Full response:', response);
        console.log('📦 Response data:', responseData);
      }
      
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        console.log('✅ Refresh token saved');
      }
      
      if (user && Object.keys(user).length > 0) {
        // Normalize user object to match expected User type
        const normalizedUser = {
          ...user,
          name: user.display_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          profile_picture: user.profile_picture || user.avatar,
        };
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
        console.log('👤 User saved:', normalizedUser.name || normalizedUser.email);
      }
    }
    
    // Return normalized user with name property
    const finalUser = {
      ...user,
      name: user.display_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      profile_picture: user.profile_picture || user.avatar,
    };
    
    return { user: finalUser as User, token };
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout/');
      console.log('✅ Logout API call successful');
    } catch (error) {
      // Don't throw error - continue with local cleanup even if API fails
      console.warn('⚠️ Logout API call failed, but continuing with local cleanup:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.onboardingComplete);
        console.log('✅ Cleared auth tokens from localStorage');
      }
    }
  },

  async getProfile(): Promise<User | null> {
    const response = await apiService.get<any>('/api/auth/me/');
    const data = response?.data || response;
    
    if (typeof window !== 'undefined' && data) {
      // Normalize user object
      const normalizedUser = {
        ...data,
        name: data.display_name || data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        profile_picture: data.profile_picture || data.avatar,
      };
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
      return normalizedUser;
    }
    return data;
  },

  async register(data: { email: string; password: string; name?: string }): Promise<{ user: User; token: string }> {
    const response = await apiService.post<any>('/api/auth/register/', data);
    const responseData = response?.data || response;
    const token = responseData?.token || responseData?.access || '';
    const user = responseData?.user || {};
    
    // Normalize user object
    const normalizedUser = {
      ...user,
      name: user.display_name || user.name || data.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      profile_picture: user.profile_picture || user.avatar,
    };
    
    return { user: normalizedUser as User, token };
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
