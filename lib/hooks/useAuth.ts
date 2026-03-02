'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { loginUser, logoutUser, registerUser, refreshUserProfile, verifyEmail } from '@/lib/store/slices/auth.slice';
import { persistor } from '@/lib/store';
import type { LoginCredentials, RegisterData } from '@/lib/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, onboardingComplete, isLoading, error } = useAppSelector((s) => s.auth);

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Auth state:', {
        hasUser: !!user,
        hasToken: !!token,
        isAuthenticated,
        userName: user?.name,
      });
    }
  }, [user, token, isAuthenticated]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      return dispatch(registerUser(data)).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Purge persisted state
      await persistor.purge();
      // Clear any remaining items in localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state and redirect
      await persistor.purge();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.push('/');
    }
  }, [dispatch, router]);

  const refreshProfile = useCallback(() => dispatch(refreshUserProfile()).unwrap(), [dispatch]);
  const verify = useCallback((t: string) => dispatch(verifyEmail(t)).unwrap(), [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    onboardingComplete,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshProfile,
    verifyEmail: verify,
  };
}
