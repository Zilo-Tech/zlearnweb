'use client';

import { useCallback, useState } from 'react';

export interface XPData {
  total_xp?: number;
  xp_this_week?: number;
  xp_this_month?: number;
  [key: string]: unknown;
}
export interface LevelData {
  current_level?: number;
  progress_percentage?: number;
  current_xp?: number;
  xp_for_next_level?: number;
  [key: string]: unknown;
}
export interface StreakData {
  current_streak?: number;
  [key: string]: unknown;
}

export function useGamification() {
  const [xpData, setXpData] = useState<XPData | null>(null);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [leaderboard, setLeaderboard] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadXP = useCallback(async () => { setXpData(null); }, []);
  const loadLevel = useCallback(async () => { setLevelData(null); }, []);
  const loadStreak = useCallback(async () => { setStreakData(null); }, []);
  const loadLeaderboard = useCallback(async (_options?: { limit?: number; period?: string }) => { setLeaderboard([]); }, []);

  return {
    xpData,
    levelData,
    streakData,
    leaderboard,
    isLoading,
    loadXP,
    loadLevel,
    loadStreak,
    loadLeaderboard,
  };
}
