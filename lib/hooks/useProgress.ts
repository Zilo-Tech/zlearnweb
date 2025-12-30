import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUserProgress, fetchLearningAnalytics, clearProgressError } from '@/lib/store/slices/progress.slice';
import { useCallback, useEffect } from 'react';

export function useProgress() {
    const dispatch = useAppDispatch();
    const { userProgress, learningAnalytics, isLoading, error } = useAppSelector(
        (state) => state.progress
    );

    const loadUserProgress = useCallback(async () => {
        return dispatch(fetchUserProgress()).unwrap();
    }, [dispatch]);

    const loadLearningAnalytics = useCallback(async () => {
        return dispatch(fetchLearningAnalytics()).unwrap();
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearProgressError());
    }, [dispatch]);

    return {
        userProgress,
        learningAnalytics,
        isLoading,
        error,
        loadUserProgress,
        loadLearningAnalytics,
        clearError,
    };
}
