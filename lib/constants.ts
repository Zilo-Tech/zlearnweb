// App constants and configuration

export const APP_CONFIG = {
    name: 'Z-Learn',
    version: '1.0.0',
    description: 'Global Digital School Platform',
    website: 'https://zlearn.education',
    supportEmail: 'support@zlearn.education',
};

export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.z-learn.app',
    timeout: 60000, // 60 seconds
    retryAttempts: 3,
};

export const STORAGE_KEYS = {
    authToken: 'zlearn_auth_token',
    refreshToken: 'zlearn_refresh_token',
    user: 'zlearn_user',
    onboardingComplete: 'zlearn_onboarding_complete',
    preferences: 'zlearn_preferences',
    language: 'zlearn_language',
    theme: 'zlearn_theme',
};

export const ANIMATION_DURATIONS = {
    short: 200,
    medium: 300,
    long: 500,
    extraLong: 800,
};

export const SCREEN_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export const EXAM_CONFIG = {
    autoSaveInterval: 30000, // 30 seconds
    warningTimeThreshold: 300, // 5 minutes
    maxRetryAttempts: 3,
    minPassingScore: 60, // percentage
};

export const NOTIFICATION_TYPES = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
} as const;

export const LESSON_TYPES = {
    video: 'video',
    text: 'text',
    quiz: 'quiz',
    exercise: 'exercise',
} as const;

export const QUESTION_TYPES = {
    multipleChoice: 'multiple-choice',
    trueFalse: 'true-false',
    shortAnswer: 'short-answer',
    essay: 'essay',
} as const;

export const EDUCATION_LEVELS = [
    { id: 'primary', name: 'Primary School', description: 'Grades 1-6' },
    { id: 'high_school', name: 'Secondary / High School', description: 'Forms 1-Upper 6' },
    { id: 'university', name: 'University / College', description: 'Undergraduate & Postgraduate' },
    { id: 'professional', name: 'Professional', description: 'Career development & Skills' },
];

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
];

export const COUNTRIES = [
    {
        id: 'cm',
        name: 'Cameroon',
        code: 'CM',
        flag: '🇨🇲',
        educationLevels: [
            { id: 'nursery', name: 'Nursery', ageRange: '3-5 years' },
            { id: 'primary', name: 'Primary', ageRange: '6-11 years' },
            { id: 'secondary', name: 'Secondary', ageRange: '12-18 years' },
            { id: 'university', name: 'University', ageRange: '18+ years' },
            { id: 'others', name: 'Others', ageRange: 'Various' },
        ],
    },
    {
        id: 'uk',
        name: 'United Kingdom',
        code: 'GB',
        flag: '🇬🇧',
        educationLevels: [
            { id: 'nursery', name: 'Nursery', ageRange: '3-4 years' },
            { id: 'primary', name: 'Primary School', ageRange: '5-11 years' },
            { id: 'secondary', name: 'Secondary School', ageRange: '11-16 years' },
            { id: 'college', name: 'Sixth Form/College', ageRange: '16-18 years' },
            { id: 'university', name: 'University', ageRange: '18+ years' },
            { id: 'others', name: 'Others', ageRange: 'Various' },
        ],
    },
    {
        id: 'us',
        name: 'United States',
        code: 'US',
        flag: '🇺🇸',
        educationLevels: [
            { id: 'preschool', name: 'Preschool', ageRange: '3-5 years' },
            { id: 'elementary', name: 'Elementary School', ageRange: '6-10 years' },
            { id: 'middle', name: 'Middle School', ageRange: '11-13 years' },
            { id: 'high', name: 'High School', ageRange: '14-18 years' },
            { id: 'university', name: 'University/College', ageRange: '18+ years' },
            { id: 'others', name: 'Others', ageRange: 'Various' },
        ],
    },
    {
        id: 'ng',
        name: 'Nigeria',
        code: 'NG',
        flag: '🇳🇬',
        educationLevels: [
            { id: 'nursery', name: 'Nursery', ageRange: '3-5 years' },
            { id: 'primary', name: 'Primary School', ageRange: '6-11 years' },
            { id: 'junior', name: 'Junior Secondary', ageRange: '12-14 years' },
            { id: 'senior', name: 'Senior Secondary', ageRange: '15-17 years' },
            { id: 'university', name: 'University', ageRange: '18+ years' },
            { id: 'others', name: 'Others', ageRange: 'Various' },
        ],
    },
];

// Color scheme matching mobile app
export const COLORS = {
    primary: '#446D6D',
    primaryLight: '#5A8A8A',
    inactive: '#9CA3AF',
    background: '#FFFFFF',
    shadow: '#000000',
    accent: '#E0F2F1',
};

// Error messages
export const ERROR_MESSAGES = {
    network: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    unauthorized: 'Unauthorized. Please log in again.',
    unknown: 'An unknown error occurred.',
    timeout: 'Request timeout. Please try again.',
};

// Routes
export const ROUTES = {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    dashboard: '/app/dashboard',
    courses: '/app/courses',
    exams: '/app/exams',
    community: '/app/community',
    profile: '/app/profile',
    onboarding: '/onboarding',
};

// User types
export const USER_TYPES = {
    academic: 'academic',
    professional: 'professional',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export const FACULTIES = [
    { id: 'science', name: 'Faculty of Science' },
    { id: 'arts', name: 'Faculty of Arts' },
    { id: 'engineering', name: 'Faculty of Engineering' },
    { id: 'medicine', name: 'Faculty of Medicine' },
    { id: 'law', name: 'Faculty of Law' },
    { id: 'economics', name: 'Faculty of Economics' },
    { id: 'education', name: 'Faculty of Education' },
];

export const SCHOOLS = [
    { id: 's1', name: 'University of Yaoundé I', type: 'University', city: 'Yaoundé' },
    { id: 's2', name: 'University of Buea', type: 'University', city: 'Buea' },
    { id: 's3', name: 'Government Bilingual High School', type: 'High School', city: 'Yaoundé' },
    { id: 's4', name: 'Sacred Heart College', type: 'High School', city: 'Mankon' },
];

export const INTERESTS = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'cs', name: 'Computer Science', icon: '💻' },
    { id: 'literature', name: 'Literature', icon: '📚' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'art', name: 'Art', icon: '🎨' },
];

export const GOALS = [
    { id: 'exam_prep', name: 'Prepare for Exams', description: 'Get ready for GCE, Baccalauréat, or University exams' },
    { id: 'improve_grades', name: 'Improve Grades', description: 'Boost your performance in specific subjects' },
    { id: 'learn_new', name: 'Learn Something New', description: 'Explore new topics and skills' },
    { id: 'career', name: 'Career Advancement', description: 'Gain skills for your professional career' },
];
