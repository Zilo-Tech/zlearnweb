import { apiService } from './api.service';

export const coursesService = {
  getEnrolled: () => apiService.get<unknown>('/api/content/enrollments/'),
  getAvailable: () => apiService.get<unknown>('/api/content/courses/'),
  getFeatured: () => apiService.get<unknown>('/api/content/courses/?featured=true'),
  getCourseDetails: (id: string) => apiService.get<unknown>(`/api/content/courses/${id}/`),
  getModules: (courseId: string) => apiService.get<unknown>(`/api/content/courses/${courseId}/modules/`),
  getModuleLessons: (moduleId: string) => apiService.get<unknown>(`/api/content/modules/${moduleId}/lessons/`),
  getProfessionalModuleLessons: (moduleId: string) =>
    apiService.get<unknown>(`/api/professional/modules/${moduleId}/lessons/`),
  getLessonDetails: (lessonId: string) => apiService.get<unknown>(`/api/content/lessons/${lessonId}/`),
  getProfessionalLessonDetails: (lessonId: string) =>
    apiService.get<unknown>(`/api/professional/lessons/${lessonId}/`),
};
