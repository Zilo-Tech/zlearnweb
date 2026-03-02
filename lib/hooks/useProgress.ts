'use client';

import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchLearningAnalytics } from '@/lib/store/slices/progress.slice';

/** Backend response shape (progress analytics endpoint) */
export interface BackendProgressAnalytics {
  study_time?: number; // total minutes
  completed_lessons?: number;
  average_score?: number;
  streak_days?: number;
  longest_streak?: number;
  total_courses?: number;
  completed_courses?: number;
  today_study_minutes?: number;
  weekly_progress?: unknown[];
  monthly_progress?: unknown[];
  [key: string]: unknown;
}

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
  learning_insights?: { current_streak?: number; longest_streak?: number };
  enrollments_count?: number;
  completed_courses?: number;
  total_progress_percentage?: number;
  [key: string]: unknown;
}

/** Map backend response to frontend-expected shape */
function transformBackendToFrontend(raw: unknown): LearningAnalyticsData & UserProgressData {
  const b = raw as BackendProgressAnalytics;
  if (!b || typeof b !== 'object') return {};

  const studyTimeMinutes = b.study_time ?? 0;
  const totalCourses = b.total_courses ?? 0;
  const completedCourses = b.completed_courses ?? 0;
  const completionRate = totalCourses > 0 ? completedCourses / totalCourses : 0;

  return {
    study_time_analytics: {
      total_study_time_hours: Math.round((studyTimeMinutes / 60) * 10) / 10,
    },
    performance_analytics: {
      average_quiz_score: b.average_score ?? 0,
      completion_rate: completionRate,
    },
    learning_insights: {
      current_streak: b.streak_days ?? 0,
      longest_streak: b.longest_streak ?? 0,
    },
    enrollments_count: totalCourses,
    completed_courses: completedCourses,
    total_progress_percentage: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
    // Pass through extra backend fields for future use
    completed_lessons: b.completed_lessons,
    today_study_minutes: b.today_study_minutes,
    weekly_progress: b.weekly_progress,
    monthly_progress: b.monthly_progress,
  };
}

export function useProgress() {
  const dispatch = useAppDispatch();
  const { learningAnalytics, isLoading } = useAppSelector((s) => s.progress);

  const loadLearningAnalytics = useCallback(() => dispatch(fetchLearningAnalytics()), [dispatch]);
  const loadUserProgress = useCallback(() => dispatch(fetchLearningAnalytics()), [dispatch]);

  const { userProgress, learningAnalytics: analytics } = useMemo(() => {
    const transformed = learningAnalytics
      ? transformBackendToFrontend(learningAnalytics)
      : null;
    return {
      userProgress: transformed as UserProgressData | null,
      learningAnalytics: transformed as LearningAnalyticsData | null,
    };
  }, [learningAnalytics]);

  return {
    learningAnalytics: analytics ?? null,
    userProgress,
    isLoading: isLoading ?? false,
    loadLearningAnalytics,
    loadUserProgress,
  };
}
