import { apiService } from './api.service';

type UserType = 'academic' | 'professional' | 'exams' | null;

function getBaseEndpoint(userType: UserType): string {
  // Professional users use /api/courses/, academic users use /api/content/
  return userType === 'professional' ? '/api/courses' : '/api/content';
}

export const coursesService = {
  // Enrollments
  getEnrolled: (userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/enrollments/`);
  },
  
  // All available courses
  getAvailable: (userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/courses/`);
  },
  
  // Featured courses
  getFeatured: (userType: UserType = null) => {
    if (userType === 'professional') {
      // Professional API has a dedicated featured endpoint
      return apiService.get<unknown>('/api/courses/featured/');
    }
    // Academic API uses query parameter
    return apiService.get<unknown>('/api/content/courses/?featured=true');
  },
  
  // Course details - note: professional uses slug, academic uses UUID
  getCourseDetails: (id: string, userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/courses/${id}/`);
  },
  
  // Course modules
  getModules: (courseId: string, userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/courses/${courseId}/modules/`);
  },
  
  // Module lessons
  getModuleLessons: (moduleId: string, userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/modules/${moduleId}/lessons/`);
  },
  
  // Lesson details
  getLessonDetails: (lessonId: string, userType: UserType = null) => {
    const base = getBaseEndpoint(userType);
    return apiService.get<unknown>(`${base}/lessons/${lessonId}/`);
  },
  
  // Enroll in course
  enrollInCourse: (courseId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.post<unknown>('/api/courses/enroll/', { course: courseId });
    }
    return apiService.post<unknown>(`/api/content/courses/${courseId}/enroll/`, {});
  },
  
  // Deprecated - for backward compatibility
  getProfessionalModuleLessons: (moduleId: string) =>
    apiService.get<unknown>(`/api/courses/modules/${moduleId}/lessons/`),
  
  getProfessionalLessonDetails: (lessonId: string) =>
    apiService.get<unknown>(`/api/courses/lessons/${lessonId}/`),
};
