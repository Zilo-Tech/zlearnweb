'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchLearningAnalytics } from '@/lib/store/slices/progress.slice';

export interface UserProgressData {
  current_courses?: { id: string; title?: string; [key: string]: unknown }[];
  enrollments_count?: number;
  completed_courses?: number;
  total_progress_percentage?: number;
  [key: string]: unknown;
}

export interface LearningAnalyticsData {
  study_time_analytics?: { total_study_time_hours?: number };
  performance_analytics?: { average_quiz_score?: number; completion_rate?: number };
  learning_insights?: { current_streak?: number };
  [key: string]: unknown;
}

export function useProgress() {
  const dispatch = useAppDispatch();
  const { learningAnalytics, isLoading } = useAppSelector((s) => s.progress);

  const loadLearningAnalytics = useCallback(() => dispatch(fetchLearningAnalytics()), [dispatch]);
  const loadUserProgress = useCallback(() => dispatch(fetchLearningAnalytics()), [dispatch]);

  const userProgress: UserProgressData | null = learningAnalytics && typeof learningAnalytics === 'object'
    ? (learningAnalytics as UserProgressData)
    : null;
  const analytics = (learningAnalytics as LearningAnalyticsData) ?? null;

  return {
    learningAnalytics: analytics,
    userProgress,
    isLoading: isLoading ?? false,
    loadLearningAnalytics,
    loadUserProgress,
  };
}
