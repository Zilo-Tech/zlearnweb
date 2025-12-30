import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    fetchPersonalizedDashboard,
    fetchRecommendations,
    fetchEntranceExam,
    fetchStudyPlan,
    clearPersonalizationError
} from '@/lib/store/slices/personalization.slice';
import { useCallback } from 'react';

export function usePersonalization() {
    const dispatch = useAppDispatch();
    const {
        dashboard,
        recommendations,
        entranceExam,
        studyPlan,
        isLoading,
        error
    } = useAppSelector((state) => state.personalization);

    const loadDashboard = useCallback(async () => {
        return dispatch(fetchPersonalizedDashboard()).unwrap();
    }, [dispatch]);

    const loadRecommendations = useCallback(async () => {
        return dispatch(fetchRecommendations()).unwrap();
    }, [dispatch]);

    const loadEntranceExam = useCallback(async () => {
        return dispatch(fetchEntranceExam()).unwrap();
    }, [dispatch]);

    const loadStudyPlan = useCallback(async () => {
        return dispatch(fetchStudyPlan()).unwrap();
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearPersonalizationError());
    }, [dispatch]);

    return {
        dashboard,
        recommendations,
        entranceExam,
        studyPlan,
        isLoading,
        error,
        loadDashboard,
        loadRecommendations,
        loadEntranceExam,
        loadStudyPlan,
        clearError,
    };
}
