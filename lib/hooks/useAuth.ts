'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { loginUser, logoutUser, registerUser, refreshUserProfile, verifyEmail } from '@/lib/store/slices/auth.slice';
import type { LoginCredentials, RegisterData } from '@/lib/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, onboardingComplete, isLoading, error } = useAppSelector((s) => s.auth);

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
    await dispatch(logoutUser()).unwrap();
    router.push('/');
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
