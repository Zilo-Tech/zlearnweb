/**
 * Exam package user API - @docs/EXAMS_USER_API.md
 * Base path: /exams/ (API baseUrl already includes /api)
 */

import { apiService } from './api.service';

export const examsService = {
  // ============ 1. Exam Discovery & Browsing ============
  /** GET /exams/ - List exams (public). school=string, include_global=1|true for school+global. subject=UUID for filtering. */
  getExams: (params?: Record<string, string | boolean | number>) => {
    const search = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') search.set(k, String(v));
      });
    }
    const q = search.toString();
    return apiService.get<{ pagination?: unknown; results?: unknown[] }>(
      q ? `/exams/?${q}` : '/exams/'
    );
  },

  /** GET /exams/<slug>/ or /exams/<uuid>/ - Exam details (public) */
  getExamDetails: (slugOrId: string) =>
    apiService.get<unknown>(`/exams/${encodeURIComponent(slugOrId)}/`),

  /** GET /exams/<exam_id>/departments/ - List departments/tracks. Optional: program=<string_id> */
  getExamDepartments: (examId: string, programId?: string) => {
    let path = `/exams/${encodeURIComponent(examId)}/departments/`;
    if (programId) path += `?program=${encodeURIComponent(programId)}`;
    return apiService.get<{ id: string; title: string; subjects?: { id: string; name: string; code?: string; icon?: string; color?: string }[] }[]>(path);
  },

  /** GET /exams/<exam_id>/courses/ - List courses. Optional: subject=<content_subject_uuid> */
  getExamCourses: (examId: string, params?: { subject?: string }) => {
    const search = new URLSearchParams();
    if (params?.subject) search.set('subject', params.subject);
    const q = search.toString();
    return apiService.get<unknown>(
      q ? `/exams/${examId}/courses/?${q}` : `/exams/${examId}/courses/`
    );
  },

  /** GET /exams/<exam_id>/courses/<slug|uuid>/ - Course details (public) */
  getExamCourseDetails: (examId: string, courseSlugOrId: string) =>
    apiService.get<unknown>(`/exams/${examId}/courses/${encodeURIComponent(courseSlugOrId)}/`),

  /** GET /exams/courses/<course_id>/modules/ - List modules (public) */
  getCourseModules: (courseId: string) =>
    apiService.get<unknown>(`/exams/courses/${courseId}/modules/`),

  /** GET /exams/courses/<course_id>/modules/<module_id>/ - Module details (public) */
  getModuleDetails: (courseId: string, moduleId: string) =>
    apiService.get<unknown>(`/exams/courses/${courseId}/modules/${moduleId}/`),

  /** GET /exams/modules/<module_id>/lessons/<lesson_id>/ - Lesson details (auth required) */
  getLessonDetails: (moduleId: string, lessonId: string) =>
    apiService.get<unknown>(`/exams/modules/${moduleId}/lessons/${lessonId}/`),

  /** GET /exams/lessons/<lesson_id>/resources/ - Lesson resources (auth) */
  getLessonResources: (lessonId: string) =>
    apiService.get<unknown>(`/exams/lessons/${lessonId}/resources/`),

  // ============ 2. Enrollment ============
  /** POST /exams/<exam_id>/enroll/ */
  enrollInExam: (examId: string, body?: { payment_method?: string; payment_reference?: string }) =>
    apiService.post<unknown>(`/exams/${examId}/enroll/`, body ?? {}),

  /** DELETE /exams/<exam_id>/unenroll/ */
  unenrollFromExam: (examId: string) =>
    apiService.delete<unknown>(`/exams/${examId}/unenroll/`),

  /** GET /exams/enrollments/my/ - My enrollments. Query: status */
  getMyEnrollments: (status?: string) => {
    const path = '/exams/enrollments/my/';
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiService.get<{ pagination?: unknown; results?: unknown[] }>(path + q);
  },

  /** GET /exams/enrollments/<enrollment_id>/analytics/ */
  getEnrollmentAnalytics: (enrollmentId: string) =>
    apiService.get<unknown>(`/exams/enrollments/${enrollmentId}/analytics/`),

  // ============ 3. Learning Content ============
  /** POST /exams/lessons/<lesson_id>/complete/ */
  completeLesson: (lessonId: string, body?: { time_spent_minutes?: number }) =>
    apiService.post<unknown>(`/exams/lessons/${lessonId}/complete/`, body ?? {}),

  // ============ 4. Mock Exams ============
  /** GET /exams/<exam_id>/mock-exams/ */
  getMockExams: (examId: string) =>
    apiService.get<unknown>(`/exams/${examId}/mock-exams/`),

  /** GET /exams/<exam_id>/mock-exams/<mock_exam_id>/ */
  getMockExamDetails: (examId: string, mockExamId: string) =>
    apiService.get<unknown>(`/exams/${examId}/mock-exams/${mockExamId}/`),

  /** POST /exams/mock-exams/<mock_exam_id>/start/ */
  startMockExamAttempt: (mockExamId: string) =>
    apiService.post<{
      id?: string;
      attempt_number?: number;
      started_at?: string;
      questions?: unknown[];
      total_questions?: number;
      duration_minutes?: number;
    }>(`/exams/mock-exams/${mockExamId}/start/`, {}),

  /** POST /exams/mock-exam-attempts/<attempt_id>/submit/ */
  submitMockExamAttempt: (attemptId: string, answers: Record<string, string>) =>
    apiService.post<{
      score?: number;
      passed?: boolean;
      correct_count?: number;
      time_taken_seconds?: number;
      results?: unknown;
      achievements_unlocked?: unknown[];
    }>(`/exams/mock-exam-attempts/${attemptId}/submit/`, { answers }),

  /** GET /exams/mock-exam-attempts/my/ - Query: exam_id */
  getMyAttempts: (examId?: string) => {
    const path = '/exams/mock-exam-attempts/my/';
    const q = examId ? `?exam_id=${encodeURIComponent(examId)}` : '';
    return apiService.get<{ pagination?: unknown; results?: unknown[] }>(path + q);
  },

  /** GET /exams/mock-exam-attempts/<attempt_id>/ */
  getAttemptDetails: (attemptId: string) =>
    apiService.get<unknown>(`/exams/mock-exam-attempts/${attemptId}/`),

  // ============ 5. Past Papers ============
  /** GET /exams/<exam_id>/past-papers/ - Query: ordering */
  getPastPapers: (examId: string, ordering?: string) => {
    const path = `/exams/${examId}/past-papers/`;
    const q = ordering ? `?ordering=${encodeURIComponent(ordering)}` : '';
    return apiService.get<unknown>(path + q);
  },

  /** GET /exams/<exam_id>/past-papers/<past_paper_id>/ */
  getPastPaperDetails: (examId: string, pastPaperId: string) =>
    apiService.get<unknown>(`/exams/${examId}/past-papers/${pastPaperId}/`),

  /** POST /exams/past-papers/<past_paper_id>/download/ */
  downloadPastPaper: (
    pastPaperId: string,
    fileType: 'question_paper' | 'answer_key' | 'marking_scheme' | 'solutions_pdf',
    deviceId?: string
  ) =>
    apiService.post<{ download_url?: string; token?: string; expires_at?: string }>(
      `/exams/past-papers/${pastPaperId}/download/`,
      { file_type: fileType, device_id: deviceId ?? '' }
    ),

  /** GET /exams/downloads/my/ - Query: exam_id */
  getMyDownloads: (examId?: string) => {
    const path = '/exams/downloads/my/';
    const q = examId ? `?exam_id=${encodeURIComponent(examId)}` : '';
    return apiService.get<unknown>(path + q);
  },

  // ============ 6. Study Tools (bookmarks, notes) ============
  /** POST /exams/questions/<question_id>/bookmark/ */
  bookmarkQuestion: (questionId: string, body?: { label?: string; color?: string }) =>
    apiService.post<unknown>(`/exams/questions/${questionId}/bookmark/`, body ?? {}),

  /** DELETE /exams/questions/<question_id>/bookmark/ */
  removeBookmark: (questionId: string) =>
    apiService.delete<unknown>(`/exams/questions/${questionId}/bookmark/`),

  /** GET /exams/bookmarks/ - Query: exam_id, mock_exam_id */
  getBookmarks: (examId?: string, mockExamId?: string) => {
    const params = new URLSearchParams();
    if (examId) params.set('exam_id', examId);
    if (mockExamId) params.set('mock_exam_id', mockExamId);
    const q = params.toString();
    return apiService.get<unknown>('/exams/bookmarks/' + (q ? '?' + q : ''));
  },

  /** POST /exams/questions/<question_id>/notes/ */
  addNote: (questionId: string, content: string) =>
    apiService.post<unknown>(`/exams/questions/${questionId}/notes/`, { content }),

  /** PUT /exams/questions/<question_id>/notes/ */
  updateNote: (questionId: string, content: string) =>
    apiService.put<unknown>(`/exams/questions/${questionId}/notes/`, { content }),

  /** DELETE /exams/questions/<question_id>/notes/ */
  deleteNote: (questionId: string) =>
    apiService.delete<unknown>(`/exams/questions/${questionId}/notes/`),

  /** GET /exams/notes/ - Query: exam_id, mock_exam_id */
  getNotes: (examId?: string, mockExamId?: string) => {
    const params = new URLSearchParams();
    if (examId) params.set('exam_id', examId);
    if (mockExamId) params.set('mock_exam_id', mockExamId);
    const q = params.toString();
    return apiService.get<unknown>('/exams/notes/' + (q ? '?' + q : ''));
  },

  // ============ 7. Achievements & Leaderboard ============
  /** GET /exams/achievements/ - Query: exam_id */
  getAchievements: (examId?: string) => {
    const path = '/exams/achievements/';
    const q = examId ? `?exam_id=${encodeURIComponent(examId)}` : '';
    return apiService.get<unknown>(path + q);
  },

  /** GET /exams/achievements/my/ */
  getMyAchievements: () => apiService.get<unknown>('/exams/achievements/my/'),

  /** GET /exams/<exam_id>/leaderboard/ - Query: type, limit */
  getLeaderboard: (examId: string, type?: 'best_score' | 'average_score', limit?: number) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (limit != null) params.set('limit', String(limit));
    const q = params.toString();
    const path = `/exams/${examId}/leaderboard/`;
    return apiService.get<unknown>(path + (q ? `?${q}` : ''));
  },

  // ============ 8. Reminders ============
  /** POST /exams/reminders/ */
  createReminder: (body: {
    exam: string;
    reminder_type: string;
    reminder_time?: string;
    reminder_date?: string;
    frequency?: string;
    message?: string;
    is_active?: boolean;
  }) => apiService.post<unknown>('/exams/reminders/', body),

  /** GET /exams/reminders/ */
  getReminders: () => apiService.get<unknown>('/exams/reminders/'),

  /** GET /exams/reminders/<reminder_id>/ */
  getReminder: (reminderId: string) =>
    apiService.get<unknown>(`/exams/reminders/${reminderId}/`),

  /** PUT/PATCH /exams/reminders/<reminder_id>/ */
  updateReminder: (reminderId: string, body: Record<string, unknown>) =>
    apiService.patch<unknown>(`/exams/reminders/${reminderId}/`, body),

  /** DELETE /exams/reminders/<reminder_id>/ */
  deleteReminder: (reminderId: string) =>
    apiService.delete<unknown>(`/exams/reminders/${reminderId}/`),
};
