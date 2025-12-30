import { apiService } from './api.service';

export interface PersonalizedDashboard {
    welcome_message?: string;
    recommended_courses?: Array<{
        id: string | number;
        title: string;
        description?: string;
        priority_order?: number;
        estimated_duration?: string;
        difficulty_level?: string;
    }>;
    academic_path?: {
        current_program?: string;
        current_level?: string;
        faculty?: string;
        school?: string;
    };
    progress_summary?: {
        courses_completed?: number;
        courses_in_progress?: number;
        total_study_hours?: number;
        achievements_unlocked?: number;
    };
    next_actions?: string[];
}

export interface RecommendationsResponse {
    academic_recommendations?: Array<{
        course: any;
        reason?: string;
        priority?: 'high' | 'medium' | 'low';
        match_score?: number;
    }>;
    skill_gap_courses?: Array<{
        course: any;
        reason?: string;
        estimated_impact?: 'high' | 'medium' | 'low';
    }>;
    career_aligned_courses?: Array<{
        course: any;
        reason?: string;
        industry_relevance?: 'high' | 'medium' | 'low';
    }>;
}

export interface EntranceExamResponse {
    exam_info?: {
        next_exam_date?: string;
        registration_deadline?: string;
        exam_type?: string;
        subjects_required?: string[];
    };
    preparation_courses?: Array<{
        course: any;
        relevance?: string;
        completion_time?: string;
    }>;
    readiness_score?: number;
    study_plan?: {
        weeks_remaining?: number;
        recommended_hours_per_week?: number;
        focus_areas?: string[];
    };
}

export interface StudyPlanResponse {
    current_goals?: string[];
    weekly_schedule?: {
        recommended_study_hours?: number;
        course_distribution?: Record<string, number>;
    };
    milestones?: Array<{
        title: string;
        due_date?: string;
        progress?: number;
    }>;
}

class PersonalizationService {
    async getDashboard(): Promise<PersonalizedDashboard> {
        return apiService.get<PersonalizedDashboard>('/api/personalization/dashboard/');
    }

    async getRecommendations(): Promise<RecommendationsResponse> {
        return apiService.get<RecommendationsResponse>('/api/personalization/recommendations/');
    }

    async getEntranceExam(): Promise<EntranceExamResponse> {
        return apiService.get<EntranceExamResponse>('/api/personalization/entrance-exam/');
    }

    async getStudyPlan(): Promise<StudyPlanResponse> {
        return apiService.get<StudyPlanResponse>('/api/personalization/study-plan/');
    }
}

export const personalizationService = new PersonalizationService();
