import { apiService } from './api.service';

type UserType = 'academic' | 'professional' | 'exams' | null;

/** Base path for professional courses (baseUrl in .env already includes /api) */
const PROFESSIONAL_API = '/courses';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return UUID_REGEX.test(id || '');
}

export const coursesService = {
  // ============ PROFESSIONAL ENDPOINTS (from COURSES_API_DOCUMENTATION.md) ============
  
  // GET /api/courses/ - List all courses
  getAvailable: async (userType: UserType = null) => {
    if (userType === 'professional') {
      const response = await apiService.get<any>(`${PROFESSIONAL_API}/`);
      // API returns { count, next, previous, results }
      return response?.results ?? response;
    }
    return apiService.get<unknown>('/content/courses/');
  },
  
  // GET course details: slug -> /courses/ (professional), UUID -> /content/courses/ (academic)
  getCourseDetails: (slugOrId: string, userType: UserType = null) => {
    const isSlug = !isUuid(slugOrId);
    if (isSlug || userType === 'professional') {
      const encoded = encodeURIComponent(slugOrId);
      return apiService.get<unknown>(`${PROFESSIONAL_API}/${encoded}/`);
    }
    return apiService.get<unknown>(`/content/courses/${slugOrId}/`);
  },
  
  // GET /api/courses/enrollments/ - User enrollments
  getEnrolled: async (userType: UserType = null) => {
    if (userType === 'professional') {
      const response = await apiService.get<any>(`${PROFESSIONAL_API}/enrollments/`);
      return response?.results ?? response;
    }
    return apiService.get<unknown>('/content/enrollments/');
  },
  
  // GET /api/courses/featured/ - Featured courses
  getFeatured: async (userType: UserType = null) => {
    if (userType === 'professional') {
      const response = await apiService.get<any>(`${PROFESSIONAL_API}/featured/`);
      return response?.results ?? response;
    }
    return apiService.get<unknown>('/content/courses/?featured=true');
  },
  
  // GET /api/courses/popular/ - Popular courses
  getPopular: async () => {
    const response = await apiService.get<any>(`${PROFESSIONAL_API}/popular/`);
    return response?.results ?? response;
  },
  
  // GET /api/courses/categories/ - Course categories
  getCategories: async () => {
    const response = await apiService.get<any>(`${PROFESSIONAL_API}/categories/`);
    return response?.results ?? response;
  },
  
  // POST /api/courses/enroll/ - Enroll in course
  enrollInCourse: (
    courseId: string,
    userType: UserType = null,
    opts?: { amount_paid?: string; payment_method?: string; payment_reference?: string }
  ) => {
    if (userType === 'professional') {
      return apiService.post<unknown>(`${PROFESSIONAL_API}/enroll/`, {
        course: courseId,
        status: 'active',
        amount_paid: opts?.amount_paid ?? '0',
        payment_method: opts?.payment_method ?? 'free',
        payment_reference: opts?.payment_reference ?? '',
      });
    }
    return apiService.post<unknown>(`/content/courses/${courseId}/enroll/`, {});
  },
  
  // GET /api/courses/progress/{course_id}/ - Course progress (UUID)
  getCourseProgress: (courseId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/progress/${courseId}/`);
    }
    return apiService.get<unknown>(`/content/courses/${courseId}/progress/`);
  },
  
  // GET /api/courses/{course_id}/reviews/ - Course reviews (UUID)
  getCourseReviews: (courseId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/${courseId}/reviews/`);
    }
    return apiService.get<unknown>(`/content/courses/${courseId}/reviews/`);
  },
  
  // POST /api/courses/reviews/create/ - Create review (course: UUID per docs)
  createCourseReview: (reviewData: { course?: string; rating: number; comment?: string }, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.post<unknown>(`${PROFESSIONAL_API}/reviews/create/`, reviewData);
    }
    return apiService.post<unknown>('/content/reviews/create/', reviewData);
  },
  
  // GET /api/courses/sections/ - Course sections (modules)
  getSections: async () => {
    const response = await apiService.get<any>(`${PROFESSIONAL_API}/sections/`);
    return response?.results ?? response;
  },
  
  // GET /api/courses/sections/{id}/ - Section details
  getSectionDetails: (sectionId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/sections/${sectionId}/`);
    }
    return apiService.get<unknown>(`/content/sections/${sectionId}/`);
  },
  
  // POST /api/courses/sections/{id}/complete/ - Complete section
  completeSection: (sectionId: string) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/sections/${sectionId}/complete/`, {}),
  
  // GET /api/courses/lessons/{id}/interactive/ - Lesson interactive content
  getLessonInteractive: (lessonId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/interactive/`),
  
  // GET /api/courses/lessons/{id}/navigation/ - Lesson navigation
  getLessonNavigation: (lessonId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/navigation/`),
  
  // POST /api/courses/lessons/{lesson_id}/complete/ - Complete lesson (returns certificate_issued if course completed)
  completeLesson: (lessonId: string, body?: { time_spent_minutes?: number }) =>
    apiService.post<{
      success?: boolean;
      message?: string;
      certificate_issued?: boolean;
      certificate_number?: string;
      course_completed?: boolean;
      xp_awarded?: number;
      xp_earned?: number;
    }>(`${PROFESSIONAL_API}/lessons/${lessonId}/complete/`, body ?? {}),

  // POST /api/courses/progress/{course_id}/update-position/ - Update current module/lesson
  updateCoursePosition: (courseId: string, data: { current_module?: string; current_lesson?: string }) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/progress/${courseId}/update-position/`, data),

  // GET /api/courses/certificates/ - List user's certificates
  getCertificates: async () => {
    const res = await apiService.get<{ results?: unknown[]; count?: number }>(`${PROFESSIONAL_API}/certificates/`);
    return Array.isArray(res) ? res : (res?.results ?? []);
  },

  // GET /api/courses/certificates/{id}/ - Certificate detail
  getCertificateDetail: (certificateId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/certificates/${certificateId}/`),

  // POST /api/courses/{course_id}/request-certificate/ - Request certificate (manual, if not auto-issued)
  requestCertificate: (courseId: string) =>
    apiService.post<{
      certificate?: { certificate_number?: string; pdf_file?: string };
      xp_earned?: number;
      message?: string;
    }>(`${PROFESSIONAL_API}/${courseId}/request-certificate/`, {}),

  // GET /api/courses/certificates/verify/{certificate_number}/ - Public verification
  verifyCertificate: (certificateNumber: string) =>
    apiService.get<{
      valid: boolean;
      is_verified?: boolean;
      student_name?: string;
      course_title?: string;
      issued_date?: string;
      certificate_number?: string;
      message?: string;
    }>(`${PROFESSIONAL_API}/certificates/verify/${encodeURIComponent(certificateNumber)}/`),
  
  // POST /api/courses/lessons/{id}/start-progress/ - Start lesson progress
  startLessonProgress: (lessonId: string) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/start-progress/`, {}),
  
  // POST /api/courses/lessons/{id}/update-progress/ - Update lesson progress
  updateLessonProgress: (lessonId: string, progressData: any) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/update-progress/`, progressData),
  
  // ============ LEGACY/COMPATIBILITY ============
  getModules: (courseIdOrSlug: string, userType: UserType = null) => {
    if (userType === 'professional') {
      const encoded = encodeURIComponent(courseIdOrSlug);
      return apiService.get<unknown>(`${PROFESSIONAL_API}/${encoded}/`);
    }
    return apiService.get<unknown>(`/content/courses/${courseIdOrSlug}/modules/`);
  },
  
  /** GET /courses/enhanced/lessons/?module={module_id} - Fetch lessons for a module */
  getEnhancedLessons: (moduleId: string) =>
    apiService.get<any[]>(`${PROFESSIONAL_API}/enhanced/lessons/?module=${moduleId}`),

  getModuleLessons: (moduleId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<any[]>(`${PROFESSIONAL_API}/enhanced/lessons/?module=${moduleId}`);
    }
    return apiService.get<unknown>(`/content/modules/${moduleId}/lessons/`);
  },
  
  /** GET full lesson detail - professional: enhanced/lessons/{id}/, academic: content/lessons/{id}/ */
  getLessonDetails: (lessonId: string, userType: UserType = null, isProfessionalCourse?: boolean) => {
    if (userType === 'professional' || isProfessionalCourse) {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/enhanced/lessons/${lessonId}/`);
    }
    return apiService.get<unknown>(`/content/lessons/${lessonId}/`);
  },
};
