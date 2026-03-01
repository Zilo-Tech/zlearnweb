import { apiService } from './api.service';
import {
    User,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    TokenRefreshResponse,
    OnboardingData,
    ApiResponse
} from '../types';

class AuthService {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiService.postUnauthenticated<ApiResponse<any>>('/api/auth/register/', data);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Registration failed');
        }

        // Normalize response to match AuthResponse type if needed
        // Backend returns { token, user } or similar
        return {
            success: true,
            data: {
                token: response.data.token,
                refresh_token: response.data.refresh_token || '',
                user: response.data.user
            },
            message: response.message || 'Registration successful'
        };
    }

    // Login user
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiService.postUnauthenticated<ApiResponse<any>>('/api/auth/login/', credentials);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
        }

        // Backend returns { token, refresh_token, user }
        const { token, refresh_token, user } = response.data;

        if (!token) {
            throw new Error('Authentication failed: No access token received');
        }

        return {
            success: true,
            data: {
                token,
                refresh_token: refresh_token || '',
                user
            },
            message: response.message || 'Login successful'
        };
    }

    // Logout user
    async logout(): Promise<void> {
        try {
            await apiService.post('/api/auth/logout/');
        } catch (error) {
            // Even if logout fails on server, clear local data
            console.error('Logout error:', error);
        }
    }

    // Refresh access token
    async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
        return apiService.postUnauthenticated<TokenRefreshResponse>('/api/auth/refresh/', {
            refresh: refreshToken,
        });
    }

    // Get user profile
    async getProfile(): Promise<User> {
        return apiService.get<User>('/api/auth/profile/');
    }

    // Update user profile
    async updateProfile(data: Partial<User>): Promise<User> {
        return apiService.patch<User>('/api/auth/profile/', data);
    }

    // Switch account type (academic <-> professional)
    async switchAccountType(userType: 'academic' | 'professional', autoClearFields: boolean = false): Promise<{
        message: string;
        user_type: string;
        previous_type?: string;
        user?: User;
        warnings?: string[]
    }> {
        const response = await apiService.post<ApiResponse<any>>(
            '/api/auth/profile/switch-account',
            { user_type: userType, auto_clear_fields: autoClearFields }
        );

        if (!response.success) {
            // Handle error response structure
            const errorData = response.data || response;
            const errorMessage = errorData.error || errorData.message || response.message || 'Failed to switch account type';

            // Handle "already set to X" case
            if (errorMessage.toLowerCase().includes('already set to') ||
                errorMessage.toLowerCase().includes('account is already')) {
                const currentUser = await this.getProfile();
                return {
                    message: errorMessage,
                    user_type: currentUser.user_type || userType,
                    previous_type: currentUser.user_type,
                    user: currentUser,
                };
            }

            const reason = errorData.reason;
            const suggestion = errorData.suggestion;

            let fullErrorMessage = errorMessage;
            if (reason) fullErrorMessage += `. ${reason}`;
            if (suggestion) fullErrorMessage += ` ${suggestion}`;

            throw new Error(fullErrorMessage);
        }

        if (!response.data) {
            throw new Error(response.message || 'Failed to switch account type');
        }

        return response.data;
    }

    // Verify email with token
    async verifyEmail(token: string): Promise<any> {
        return apiService.post('/api/auth/verify-email/', { token });
    }

    // Resend verification email
    async resendVerification(): Promise<any> {
        return apiService.post('/api/auth/resend-verification/');
    }

    // Request password reset
    async requestPasswordReset(email: string): Promise<any> {
        return apiService.postUnauthenticated('/api/auth/password/reset/', { email });
    }

    // Confirm password reset
    async confirmPasswordReset(token: string, newPassword: string): Promise<any> {
        return apiService.postUnauthenticated('/api/auth/password/reset/confirm/', {
            token,
            new_password: newPassword,
        });
    }

    // Change password (authenticated)
    async changePassword(currentPassword: string, newPassword: string): Promise<any> {
        return apiService.post('/api/auth/password/change/', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: newPassword,
        });
    }

    // Complete onboarding
    async completeOnboarding(data: OnboardingData): Promise<User> {
        return apiService.post<User>('/api/auth/complete-onboarding/', data);
    }

    // Get education options for onboarding
    async getEducationOptions(): Promise<any> {
        return apiService.get('/api/auth/education-options/');
    }

    // Social login - Google
    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        return apiService.postUnauthenticated<AuthResponse>('/api/auth/google/', {
            idToken,
        });
    }

    // Social login - Facebook
    async loginWithFacebook(accessToken: string): Promise<AuthResponse> {
        return apiService.postUnauthenticated<AuthResponse>('/api/auth/facebook/', {
            accessToken,
        });
    }

    // Social login - Apple
    async loginWithApple(idToken: string, user?: any): Promise<AuthResponse> {
        return apiService.postUnauthenticated<AuthResponse>('/api/auth/apple/', {
            idToken,
            user,
        });
    }

    // Get user dashboard data
    async getDashboard(): Promise<any> {
        return apiService.get('/api/auth/dashboard/');
    }

    // Get user XP data
    async getXP(): Promise<any> {
        return apiService.get('/api/auth/xp/');
    }

    // Get user level data
    async getLevel(): Promise<any> {
        return apiService.get('/api/auth/level/');
    }

    // Get notification settings
    async getNotificationSettings(): Promise<any> {
        return apiService.get('/api/auth/notifications/settings/');
    }

    // Update notification settings
    async updateNotificationSettings(settings: any): Promise<any> {
        return apiService.patch('/api/auth/notifications/settings/', settings);
    }

    // Delete account
    async deleteAccount(): Promise<void> {
        return apiService.delete('/api/auth/profile/delete/');
    }
}

export const authService = new AuthService();
