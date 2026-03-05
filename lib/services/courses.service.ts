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
  
  // GET course progress - professional: /courses/progress/{id}/, academic: /content/progress/courses/{id}/
  getCourseProgress: (courseId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/progress/${courseId}/`);
    }
    return apiService.get<unknown>(`/content/progress/courses/${courseId}/`);
  },
  
  // GET /api/courses/{course_id}/reviews/ - Course reviews (UUID)
  getCourseReviews: (courseId: string, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.get<unknown>(`${PROFESSIONAL_API}/${courseId}/reviews/`);
    }
    return apiService.get<unknown>(`/content/courses/${courseId}/reviews/`);
  },
  
  // Create review - professional: POST /courses/reviews/create/, academic: POST /content/courses/{id}/reviews/create/
  createCourseReview: (reviewData: { course?: string; rating: number; comment?: string }, userType: UserType = null) => {
    if (userType === 'professional') {
      return apiService.post<unknown>(`${PROFESSIONAL_API}/reviews/create/`, reviewData);
    }
    const courseId = reviewData.course;
    if (!courseId) return Promise.reject(new Error('Course ID required for review'));
    return apiService.post<unknown>(`/content/courses/${courseId}/reviews/create/`, {
      rating: reviewData.rating,
      comment: reviewData.comment ?? '',
    });
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
  
  // POST /api/courses/sections/{id}/complete/ - Complete section (professional)
  completeSection: (sectionId: string) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/sections/${sectionId}/complete/`, {}),

  // POST /api/content/sections/{section_id}/complete/ - Complete section (academic)
  completeContentSection: (
    sectionId: string,
    data: { time_spent_seconds?: number; metadata?: { video_completed?: boolean; quiz_score?: number } }
  ) =>
    apiService.post<{ success?: boolean; message?: string; progress_percentage?: number }>(
      `/content/sections/${sectionId}/complete/`,
      data
    ),
  
  // GET /api/courses/lessons/{id}/interactive/ - Lesson interactive content
  getLessonInteractive: (lessonId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/interactive/`),
  
  // GET /api/courses/lessons/{id}/navigation/ - Lesson navigation
  getLessonNavigation: (lessonId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/navigation/`),
  
  // Complete lesson - professional: /courses/lessons/{id}/complete/, academic: /content/lessons/{id}/complete/
  completeLesson: (
    lessonId: string,
    body?: { time_spent_minutes?: number; metadata?: Record<string, unknown> },
    isProfessionalCourse?: boolean
  ) => {
    const payload = body ?? {};
    if (isProfessionalCourse) {
      return apiService.post<{
        success?: boolean;
        message?: string;
        certificate_issued?: boolean;
        certificate_number?: string;
        course_completed?: boolean;
        xp_awarded?: number;
        xp_earned?: number;
      }>(`${PROFESSIONAL_API}/lessons/${lessonId}/complete/`, payload);
    }
    return apiService.post<{
      success?: boolean;
      message?: string;
      xp_awarded?: number;
      level_up?: boolean;
      new_level?: unknown;
      next_unlocked?: { type?: string; id?: string; title?: string };
    }>(`/content/lessons/${lessonId}/complete/`, payload);
  },

  // Update course position - professional: /courses/progress/{id}/update-position/, academic: /content/progress/courses/{id}/update-position/
  updateCoursePosition: (
    courseId: string,
    data: { current_module?: string; current_lesson?: string },
    userType: UserType = null
  ) => {
    if (userType === 'professional') {
      return apiService.post<unknown>(`${PROFESSIONAL_API}/progress/${courseId}/update-position/`, data);
    }
    return apiService.post<unknown>(`/content/progress/courses/${courseId}/update-position/`, data);
  },

  // GET /api/courses/certificates/ - List user's certificates (professional)
  getCertificates: async () => {
    const res = await apiService.get<{ results?: unknown[]; count?: number }>(`${PROFESSIONAL_API}/certificates/`);
    return Array.isArray(res) ? res : (res?.results ?? []);
  },

  // GET /api/courses/certificates/{id}/ - Certificate detail (professional)
  getCertificateDetail: (certificateId: string) =>
    apiService.get<unknown>(`${PROFESSIONAL_API}/certificates/${certificateId}/`),

  // POST /api/courses/{course_id}/request-certificate/ - Request certificate (professional)
  requestCertificate: (courseId: string) =>
    apiService.post<{
      certificate?: { certificate_number?: string; pdf_file?: string };
      xp_earned?: number;
      message?: string;
    }>(`${PROFESSIONAL_API}/${courseId}/request-certificate/`, {}),

  // GET /api/courses/certificates/verify/{certificate_number}/ - Public verification (professional)
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

  // ============ CONTENT (ACADEMIC) CERTIFICATES ============
  // GET /api/content/certificates/
  getContentCertificates: async () => {
    const res = await apiService.get<unknown[] | { results?: unknown[] }>('/content/certificates/');
    return Array.isArray(res) ? res : (res as { results?: unknown[] })?.results ?? [];
  },
  // GET /api/content/certificates/{certificate_number}/
  getContentCertificateDetail: (certificateNumber: string) =>
    apiService.get<unknown>(`/content/certificates/${encodeURIComponent(certificateNumber)}/`),
  // POST /api/content/courses/{course_id}/request-certificate/
  requestContentCertificate: (courseId: string) =>
    apiService.post<{ message?: string; certificate?: { id?: string; certificate_number?: string; pdf_file?: string }; xp_earned?: number }>(
      `/content/courses/${courseId}/request-certificate/`,
      {}
    ),
  // GET /api/content/certificates/{certificate_number}/verify/ (public)
  verifyContentCertificate: (certificateNumber: string) =>
    apiService.get<{
      valid: boolean;
      certificate_number?: string;
      student_name?: string;
      course_title?: string;
      issued_date?: string;
      final_grade?: number | null;
      is_verified?: boolean;
      message?: string;
    }>(`/content/certificates/${encodeURIComponent(certificateNumber)}/verify/`),

  /** Try content verify first, then professional (for public verify page). */
  async verifyCertificateAny(certificateNumber: string): Promise<{
    valid: boolean;
    student_name?: string;
    course_title?: string;
    issued_date?: string;
    certificate_number?: string;
    message?: string;
    final_grade?: number | null;
  }> {
    try {
      return (await this.verifyContentCertificate(certificateNumber)) as {
        valid: boolean;
        student_name?: string;
        course_title?: string;
        issued_date?: string;
        certificate_number?: string;
        message?: string;
        final_grade?: number | null;
      };
    } catch {
      return (await this.verifyCertificate(certificateNumber)) as {
        valid: boolean;
        student_name?: string;
        course_title?: string;
        issued_date?: string;
        certificate_number?: string;
        message?: string;
      };
    }
  },
  
  // POST /api/courses/lessons/{id}/start-progress/ - Start lesson progress
  startLessonProgress: (lessonId: string) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/start-progress/`, {}),
  
  // POST /api/courses/lessons/{id}/update-progress/ - Update lesson progress
  updateLessonProgress: (lessonId: string, progressData: any) =>
    apiService.post<unknown>(`${PROFESSIONAL_API}/lessons/${lessonId}/update-progress/`, progressData),
  
  // ============ CONTENT (ACADEMIC) SPECIFIC ============
  // GET /api/content/subjects/ - List subjects (academic)
  getSubjects: () => apiService.get<unknown>('/content/subjects/'),

  // GET /api/content/search/ - Full-text search (academic)
  searchContent: (query: string, params?: { type?: string; subject?: string; difficulty?: string }) => {
    const searchParams = new URLSearchParams({ q: query });
    if (params?.type) searchParams.set('type', params.type);
    if (params?.subject) searchParams.set('subject', params.subject);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    return apiService.get<{
      query?: string;
      results?: { courses?: unknown[]; modules?: unknown[]; lessons?: unknown[] };
      total_results?: number;
    }>(`/content/search/?${searchParams.toString()}`);
  },

  // GET /api/content/progress/ - User progress overview (academic)
  getContentProgressOverview: () => apiService.get<unknown>('/content/progress/'),

  // POST /api/content/lessons/{id}/progress/ - Update lesson progress without completing (academic)
  updateLessonProgressContent: (lessonId: string, data: { time_spent_minutes?: number; progress_percentage?: number; metadata?: Record<string, unknown> }) =>
    apiService.post<unknown>(`/content/lessons/${lessonId}/progress/`, data),

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
