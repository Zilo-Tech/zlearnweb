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
  timeout: 60000,
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

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  dashboard: '/app/dashboard',
  courses: '/app/courses',
  community: '/app/community',
  profile: '/app/profile',
  onboarding: '/onboarding',
};

export const EDUCATION_LEVELS = [
  { id: 'primary', name: 'Primary School', description: 'Grades 1-6' },
  { id: 'high_school', name: 'Secondary / High School', description: 'Forms 1-Upper 6' },
  { id: 'university', name: 'University / College', description: 'Undergraduate & Postgraduate' },
  { id: 'professional', name: 'Professional', description: 'Career development & Skills' },
];

export const COUNTRIES = [
  { id: 'cm', name: 'Cameroon', code: 'CM', flag: '🇨🇲', educationLevels: [] },
  { id: 'uk', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', educationLevels: [] },
  { id: 'us', name: 'United States', code: 'US', flag: '🇺🇸', educationLevels: [] },
  { id: 'ng', name: 'Nigeria', code: 'NG', flag: '🇳🇬', educationLevels: [] },
];

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
