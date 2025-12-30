import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchXP, fetchLevel, fetchStreakData, fetchAchievements, fetchLeaderboard } from '@/lib/store/slices/gamification.slice';
import { useCallback } from 'react';

export function useGamification() {
    const dispatch = useAppDispatch();
    const { xpData, levelData, streakData, achievements, leaderboard, isLoading, error } = useAppSelector(
        (state) => state.gamification
    );

    const loadXP = useCallback(async () => {
        return dispatch(fetchXP()).unwrap();
    }, [dispatch]);

    const loadLevel = useCallback(async () => {
        return dispatch(fetchLevel()).unwrap();
    }, [dispatch]);

    const loadStreak = useCallback(async () => {
        return dispatch(fetchStreakData()).unwrap();
    }, [dispatch]);

    const loadAchievements = useCallback(async () => {
        return dispatch(fetchAchievements()).unwrap();
    }, [dispatch]);

    const loadLeaderboard = useCallback(async (params?: { period?: 'daily' | 'weekly' | 'monthly' | 'all-time'; limit?: number }) => {
        return dispatch(fetchLeaderboard(params)).unwrap();
    }, [dispatch]);

    return {
        xpData,
        levelData,
        streakData,
        achievements,
        leaderboard,
        isLoading,
        error,
        loadXP,
        loadLevel,
        loadStreak,
        loadAchievements,
        loadLeaderboard,
    };
}
