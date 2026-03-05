import { apiService } from './api.service';

// ─── Academic endpoints  (/api/content/) ──────────────────────────────────────
// Mirrors mobile coursesService.ts
const academic = {
  getEnrolled: () => apiService.get<any>('/api/content/enrollments/'),
  getAvailable: (params?: object) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiService.get<any>(`/api/content/courses/${qs}`);
  },
  getFeatured: () => apiService.get<any>('/api/content/courses/?featured=true'),
  getCourseDetails: (id: string) => apiService.get<any>(`/api/content/courses/${id}/`),
  getModules: (courseId: string) => apiService.get<any>(`/api/content/courses/${courseId}/modules/`),
  getModuleLessons: (moduleId: string) => apiService.get<any>(`/api/content/modules/${moduleId}/lessons/`),
  getLessonDetails: (lessonId: string) => apiService.get<any>(`/api/content/lessons/${lessonId}/`),
  // Academic: POST /api/content/courses/{id}/enroll/
  enroll: (courseId: string) => apiService.post<any>(`/api/content/courses/${courseId}/enroll/`, {}),
  // Academic: POST /api/content/lessons/{id}/complete/
  markLessonComplete: (lessonId: string, body?: object) =>
    apiService.post<any>(`/api/content/lessons/${lessonId}/complete/`, body ?? {}),
  // Academic: GET /api/content/progress/courses/{courseId}/
  getCourseProgress: (courseId: string) => apiService.get<any>(`/api/content/progress/courses/${courseId}/`),
};

// ─── Professional endpoints  (/api/courses/) ──────────────────────────────────
// Mirrors mobile courseService.ts
const professional = {
  getEnrolled: () => apiService.get<any>('/api/courses/enrollments/'),
  getAvailable: (params?: object) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiService.get<any>(`/api/courses/${qs}`);
  },
  getFeatured: () => apiService.get<any>('/api/courses/featured/'),
  getCourseDetails: (slugOrId: string) => apiService.get<any>(`/api/courses/${slugOrId}/`),
  getModules: (courseId: string) => apiService.get<any>(`/api/courses/${courseId}/modules/`),
  getModuleLessons: (moduleId: string) => apiService.get<any>(`/api/courses/modules/${moduleId}/lessons/`),
  getLessonDetails: (lessonId: string) => apiService.get<any>(`/api/courses/lessons/${lessonId}/`),
  // Professional: POST /api/courses/enroll/ { course: courseId }
  enroll: (courseId: string) => apiService.post<any>('/api/courses/enroll/', { course: courseId }),
  // Professional: POST /api/courses/lessons/{id}/complete/
  markLessonComplete: (lessonId: string, body?: object) =>
    apiService.post<any>(`/api/courses/lessons/${lessonId}/complete/`, body ?? {}),
  // Professional: GET /api/courses/progress/{courseId}/
  getCourseProgress: (courseId: string) => apiService.get<any>(`/api/courses/progress/${courseId}/`),
  // Professional: GET /api/courses/lessons/{id}/navigation/
  getLessonNavigation: (lessonId: string) => apiService.get<any>(`/api/courses/lessons/${lessonId}/navigation/`),
};

export type UserCourseType = 'academic' | 'professional' | 'exams' | null;

// Returns the right service based on user_type, same logic as mobile HomeScreen
export function getCourseService(userType: UserCourseType) {
  return userType === 'professional' ? professional : academic;
}

// Backwards-compat default export (professional paths — kept for direct slug lookups)
export const coursesService = {
  ...professional,
  // academic-specific helpers still exposed explicitly
  getAcademicEnrolled: academic.getEnrolled,
  getAcademicFeatured: academic.getFeatured,
  getAcademicAvailable: academic.getAvailable,
  // professional-specific
  getProfessionalEnrolled: professional.getEnrolled,
  getProfessionalFeatured: professional.getFeatured,
  // lesson detail — both paths kept for lesson viewer
  getLessonDetails: (lessonId: string) => professional.getLessonDetails(lessonId),
  getProfessionalLessonDetails: (lessonId: string) => professional.getLessonDetails(lessonId),
  getProfessionalModuleLessons: (moduleId: string) => professional.getModuleLessons(moduleId),
};
