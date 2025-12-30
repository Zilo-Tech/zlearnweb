import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loginUser, logoutUser, registerUser, refreshUserProfile, verifyEmail } from '@/lib/store/slices/auth.slice';
import { LoginCredentials, RegisterData } from '../types';
import { useCallback } from 'react';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, token, isAuthenticated, onboardingComplete, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

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
        return dispatch(logoutUser()).unwrap();
    }, [dispatch]);

    const refreshProfile = useCallback(async () => {
        return dispatch(refreshUserProfile()).unwrap();
    }, [dispatch]);

    const verify = useCallback(async (token: string) => {
        return dispatch(verifyEmail(token)).unwrap();
    }, [dispatch]);

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
