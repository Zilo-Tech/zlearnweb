// Core types for the Z-Learn web application

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    user_type: 'academic' | 'professional';
    is_email_verified: boolean;
    onboarding_complete: boolean;
    profile_picture?: string;
    country?: string;
    education_level?: string;
    school?: string;
    faculty?: string;
    class_level?: string;
    program?: string;
    curricula?: string[];
    learning_goals?: string[];
    daily_study_time?: string;
    learning_styles?: string[];
    created_at: string;
    updated_at: string;
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        refresh_token: string;
        user: User;
    };
    message: string;
}

export interface TokenRefreshResponse {
    success: boolean;
    data: {
        token: string;
    };
    message: string;
}

// Course types
export interface Course {
    id: string;
    title: string;
    description: string;
    slug: string;
    thumbnail?: string;
    subject?: {
        name: string;
        code: string;
        color?: string;
    };
    curriculum?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | string;
    estimated_hours?: number;
    duration_hours?: number;
    is_featured: boolean;
    is_published: boolean;
    instructor?: string | { id: number; name: string; bio?: string };
    rating?: number;
    enrolled_count?: number;
    lesson_count?: number;
    module_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ProfessionalCourse extends Course {
    category?: string;
    level?: string;
    price?: number;
    is_free: boolean;
    modules?: Module[];
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    order: number;
    lessons?: Lesson[];
    is_locked: boolean;
}

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    lesson_type: 'video' | 'text' | 'quiz' | 'exercise';
    content?: string;
    video_url?: string;
    duration_minutes?: number;
    order: number;
    is_locked: boolean;
    is_completed?: boolean;
    sections?: Section[];
}

export interface Section {
    id: string;
    title: string;
    content?: string;
    video_url?: string;
    duration_seconds?: number;
    order: number;
    is_completed?: boolean;
}

// Progress types
export interface UserProgress {
    enrollments_count: number;
    completed_courses: number;
    total_progress_percentage: number;
    current_courses: Array<{
        id: string;
        title: string;
        subject: {
            name: string;
            code: string;
        };
        progress_percentage: number;
        last_accessed: string;
    }>;
}

export interface LearningAnalytics {
    study_time_analytics?: {
        total_study_time_hours: number;
        average_daily_study_time: number;
        study_time_by_day?: Array<{
            date: string;
            study_time_minutes: number;
        }>;
        study_time_by_subject?: Array<{
            subject: string;
            study_time_hours: number;
            lessons_completed: number;
        }>;
    };
    performance_analytics?: {
        average_quiz_score: number;
        completion_rate: number;
        difficulty_progression?: Array<{
            week: number;
            average_difficulty: number;
            completion_rate: number;
        }>;
    };
    learning_insights?: {
        learning_style?: string;
        strong_subjects?: string[];
        improvement_areas?: string[];
        optimal_study_time?: string;
        current_streak?: number;
        longest_streak?: number;
        total_study_days?: number;
    };
}

export interface CourseProgress {
    course_id: string;
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    time_spent_minutes: number;
    last_accessed: string;
    current_module?: string;
    current_lesson?: string;
}

export interface LessonProgress {
    lesson_id: string;
    is_completed: boolean;
    time_spent_minutes: number;
    video_progress_seconds?: number;
    completed_at?: string;
}

// Exam types
export interface Exam {
    id: string;
    title: string;
    description?: string;
    subject?: string;
    duration_minutes: number;
    total_marks: number;
    passing_marks: number;
    is_published: boolean;
    questions?: Question[];
    created_at: string;
}

export interface Question {
    id: string;
    question_text: string;
    question_type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
    marks: number;
    order: number;
    options?: QuestionOption[];
    correct_answer?: string;
    explanation?: string;
}

export interface QuestionOption {
    id: string;
    option_text: string;
    is_correct: boolean;
}

export interface ExamAttempt {
    id: string;
    exam_id: string;
    user_id: string;
    score: number;
    percentage: number;
    passed: boolean;
    time_taken_minutes: number;
    answers: ExamAnswer[];
    started_at: string;
    completed_at?: string;
}

export interface ExamAnswer {
    question_id: string;
    answer: string;
    is_correct?: boolean;
    marks_awarded?: number;
}

// Community types
export interface Forum {
    id: string;
    name: string;
    description?: string;
    course?: string;
    is_public: boolean;
    discussion_count: number;
    member_count: number;
    created_at: string;
}

export interface Discussion {
    id: string;
    forum: string;
    title: string;
    content: string;
    author: string;
    author_name?: string;
    author_avatar?: string;
    reply_count: number;
    like_count: number;
    view_count: number;
    is_pinned: boolean;
    is_closed: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
}

export interface Reply {
    id: string;
    discussion: string;
    content: string;
    author: string;
    author_name?: string;
    author_avatar?: string;
    parent_reply?: string;
    like_count: number;
    created_at: string;
    updated_at: string;
}

export interface StudyGroup {
    id: string;
    name: string;
    description?: string;
    course?: string;
    creator: string;
    is_public: boolean;
    member_count: number;
    max_members?: number;
    requires_approval: boolean;
    created_at: string;
}

// Gamification types
export interface XPData {
    total_xp: number;
    current_level_xp: number;
    next_level_xp: number;
    xp_to_next_level: number;
    xp_this_week?: number;
    xp_this_month?: number;
}

export interface LevelData {
    current_level: number;
    level_name: string;
    next_level: number;
    next_level_name: string;
    current_xp?: number;
    xp_for_next_level?: number;
    progress_percentage?: number;
}

export interface StreakData {
    current_streak: number;
    longest_streak: number;
    last_activity_date: string;
    streak_protected: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon?: string;
    xp_reward: number;
    is_unlocked: boolean;
    unlocked_at?: string;
}

// Notification types
export interface Notification {
    id: string;
    notification_type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    data?: Record<string, any>;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
}

// Form types
export interface OnboardingData {
    country?: string;
    education_level?: string;
    school?: string;
    faculty?: string;
    class_level?: string;
    program?: string;
    curricula?: string[];
    learning_goals?: string[];
    daily_study_time?: string;
    learning_styles?: string[];
    professional_background?: string;
    professional_goals?: string[];
    user_type?: 'academic' | 'professional';
    interests?: string[];
    goal?: string;
}

// Filter types
export interface CourseFilters {
    subject?: string;
    curriculum?: string;
    difficulty?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export interface ExamFilters {
    subject?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

// State types
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface AuthState extends LoadingState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    onboardingComplete: boolean;
}

export interface CoursesState extends LoadingState {
    enrolled: Course[];
    available: Course[];
    featured: Course[];
    currentCourse: Course | null;
    progress: Record<string, CourseProgress>;
}

export interface ExamsState extends LoadingState {
    exams: Exam[];
    practiceTests: Exam[];
    currentExam: Exam | null;
    results: ExamAttempt[];
}

export interface CommunityState extends LoadingState {
    forums: Forum[];
    discussions: Discussion[];
    studyGroups: StudyGroup[];
    notifications: Notification[];
}

export interface GamificationState extends LoadingState {
    xpData: XPData | null;
    levelData: LevelData | null;
    streakData: StreakData | null;
    achievements: Achievement[];
}

export interface ProgressState extends LoadingState {
    userProgress: UserProgress | null;
    learningAnalytics: LearningAnalytics | null;
}
