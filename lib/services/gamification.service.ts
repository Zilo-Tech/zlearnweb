import { apiService } from './api.service';
import { XPData, LevelData, StreakData, Achievement } from '../types';

class GamificationService {
    // Get XP data
    async getXP(): Promise<XPData> {
        return apiService.get<XPData>('/api/auth/xp/');
    }

    // Award XP
    async awardXP(request: {
        action: string;
        metadata?: any;
    }): Promise<{
        xp_awarded: number;
        total_xp: number;
        level_up: boolean;
        new_level?: number;
    }> {
        return apiService.post('/api/auth/xp/award/', request);
    }

    // Get level data
    async getLevel(): Promise<LevelData> {
        return apiService.get<LevelData>('/api/auth/level/');
    }

    // Get streak data
    async getStreakData(): Promise<StreakData> {
        return apiService.get<StreakData>('/api/gamification/streak/');
    }

    // Get achievements
    async getAchievements(): Promise<Achievement[]> {
        const response = await apiService.get<any>('/api/gamification/achievements/');
        return response.results || response;
    }

    // Get unlocked achievements
    async getUnlockedAchievements(): Promise<Achievement[]> {
        const response = await apiService.get<any>('/api/gamification/achievements/unlocked/');
        return response.results || response;
    }

    // Get leaderboard
    async getLeaderboard(params?: {
        period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
        limit?: number;
    }): Promise<any[]> {
        const queryParams = new URLSearchParams();
        if (params?.period) queryParams.append('period', params.period);
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const response = await apiService.get<any>(
            `/api/gamification/leaderboard/${queryString ? `?${queryString}` : ''}`
        );
        return response.results || response;
    }
}

export const gamificationService = new GamificationService();
