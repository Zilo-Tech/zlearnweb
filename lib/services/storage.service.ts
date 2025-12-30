import { STORAGE_KEYS } from '../constants';

class StorageService {
    // Check if we're in browser environment
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }

    // Generic get item
    getItem<T>(key: string, defaultValue: T): T {
        if (!this.isBrowser()) return defaultValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    // Generic set item
    setItem<T>(key: string, value: T): void {
        if (!this.isBrowser()) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }

    // Remove item
    removeItem(key: string): void {
        if (!this.isBrowser()) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }

    // Clear all storage
    clear(): void {
        if (!this.isBrowser()) return;

        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // Auth token methods
    getAuthToken(): string | null {
        return this.getItem<string | null>(STORAGE_KEYS.authToken, null);
    }

    setAuthToken(token: string): void {
        this.setItem(STORAGE_KEYS.authToken, token);
    }

    removeAuthToken(): void {
        this.removeItem(STORAGE_KEYS.authToken);
    }

    // Refresh token methods
    getRefreshToken(): string | null {
        return this.getItem<string | null>(STORAGE_KEYS.refreshToken, null);
    }

    setRefreshToken(token: string): void {
        this.setItem(STORAGE_KEYS.refreshToken, token);
    }

    removeRefreshToken(): void {
        this.removeItem(STORAGE_KEYS.refreshToken);
    }

    // User data methods
    getUser<T>(): T | null {
        return this.getItem<T | null>(STORAGE_KEYS.user, null);
    }

    setUser<T>(user: T): void {
        this.setItem(STORAGE_KEYS.user, user);
    }

    removeUser(): void {
        this.removeItem(STORAGE_KEYS.user);
    }

    // Onboarding status
    getOnboardingComplete(): boolean {
        return this.getItem<boolean>(STORAGE_KEYS.onboardingComplete, false);
    }

    setOnboardingComplete(complete: boolean): void {
        this.setItem(STORAGE_KEYS.onboardingComplete, complete);
    }

    // Preferences
    getPreferences<T>(): T | null {
        return this.getItem<T | null>(STORAGE_KEYS.preferences, null);
    }

    setPreferences<T>(preferences: T): void {
        this.setItem(STORAGE_KEYS.preferences, preferences);
    }

    // Language
    getLanguage(): string {
        return this.getItem<string>(STORAGE_KEYS.language, 'en');
    }

    setLanguage(language: string): void {
        this.setItem(STORAGE_KEYS.language, language);
    }

    // Theme
    getTheme(): 'light' | 'dark' | 'system' {
        return this.getItem<'light' | 'dark' | 'system'>(STORAGE_KEYS.theme, 'system');
    }

    setTheme(theme: 'light' | 'dark' | 'system'): void {
        this.setItem(STORAGE_KEYS.theme, theme);
    }

    // Clear all auth data
    clearAuthData(): void {
        this.removeAuthToken();
        this.removeRefreshToken();
        this.removeUser();
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}

export const storageService = new StorageService();
