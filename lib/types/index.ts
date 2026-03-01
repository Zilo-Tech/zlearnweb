export interface User {
  id: string;
  email: string;
  name?: string;
  profile_picture?: string;
  user_type?: 'academic' | 'professional' | 'exams';
  onboarding_complete?: boolean;
  [key: string]: unknown;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  subject?: { name: string };
  slug?: string;
  estimated_hours?: number;
  difficulty?: string;
  lesson_count?: number;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

export interface OnboardingData {
  user_type?: 'academic' | 'professional' | 'exams';
  name?: string;
  age?: number;
  country?: string;
  education_level?: string;
  faculty?: string;
  school?: string;
  class?: string;
  curriculum?: string;
  interests?: string[];
  profession?: string;
  goals?: string[];
  exam_types?: string[];
  [key: string]: unknown;
}
