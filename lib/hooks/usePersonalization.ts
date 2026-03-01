'use client';

import { useCallback, useState } from 'react';

export interface RecommendationsData {
  recommendations?: unknown[];
  academic_recommendations?: { course?: unknown; reason?: string }[];
  skill_gap_courses?: { course?: unknown; reason?: string }[];
  career_aligned_courses?: { course?: unknown; reason?: string }[];
  [key: string]: unknown;
}

export function usePersonalization() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      setDashboard({ welcome_message: {} });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { dashboard, recommendations, isLoading, loadDashboard, loadRecommendations };
}
