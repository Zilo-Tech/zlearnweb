import { apiService } from './api.service';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked_at?: string;
    points: number;
}

export interface UserProgress {
    enrollments_count: number;
    active_enrollments: number;
    completed_courses: number;
    total_progress_percentage: number;
    current_courses: Array<{
        id: number;
        title: string;
        subject: {
            name: string;
            code: string;
        };
        progress_percentage: number;
        last_accessed: string;
    }>;
}

class ProgressService {
    /**
     * Get user progress overview
     * Backend: GET /api/progress/
     */
    async getUserProgress(): Promise<any> {
        const response = await apiService.get<any>('/api/progress/');
        return response.data || response;
    }

    /**
     * Get learning analytics
     * Backend: GET /api/progress/analytics/
     */
    async getLearningAnalytics(): Promise<any> {
        const response = await apiService.get<any>('/api/progress/analytics/');
        return response.data || response;
    }

    /**
     * Get course progress
     * Backend: GET /api/content/progress/courses/{course_id}/
     */
    async getCourseProgress(courseId: string): Promise<any> {
        const response = await apiService.get<any>(`/api/content/progress/courses/${courseId}/`);
        return response.data || response;
    }

    /**
     * Get user achievements
     * Backend: GET /api/progress/achievements/
     */
    async getAchievements(): Promise<Achievement[]> {
        const response = await apiService.get<any>('/api/progress/achievements/');
        return response.data || response;
    }

    /**
     * Get learning streaks
     * Backend: GET /api/progress/streaks/
     */
    async getLearningStreaks(): Promise<any> {
        const response = await apiService.get<any>('/api/progress/streaks/');
        return response.data || response;
    }

    /**
     * Get progress dashboard
     * Backend: GET /api/progress/dashboard/
     */
    async getProgressDashboard(): Promise<any> {
        const response = await apiService.get<any>('/api/progress/dashboard/');
        return response.data || response;
    }
}

export const progressService = new ProgressService();
