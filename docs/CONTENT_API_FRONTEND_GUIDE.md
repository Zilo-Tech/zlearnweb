# Content App API - Frontend Integration Guide

**Complete integration guide for React Native, React, and Vue.js frontends**

**Last Updated**: March 3, 2026  
**API Version**: 1.0  
**Base URL**: `/api/content/`

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Course Discovery](#course-discovery)
4. [Course Detail & Enrollment](#course-detail--enrollment)
5. [Learning Flow](#learning-flow)
6. [Progress Tracking](#progress-tracking)
7. [Certificates](#certificates)
8. [Reviews & Ratings](#reviews--ratings)
9. [Complete User Flows](#complete-user-flows)
10. [TypeScript Types](#typescript-types)
11. [React Hooks](#react-hooks)
12. [Error Handling](#error-handling)
13. [Offline Support](#offline-support)

---

## Quick Start

### Installation

```bash
npm install axios react-query
# or
yarn add axios react-query
```

### Setup API Client

```typescript
// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Authentication

All endpoints require JWT authentication. Include the token in the `Authorization` header:

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await axios.post('/api/accounts/auth/login/', {
    email,
    password,
  });
  
  const { access, refresh, user } = response.data;
  
  // Store tokens
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { access, refresh, user };
};

// Logout
const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};
```

---

## Course Discovery

### 1. List Subjects

**Display subject categories for course browsing**

```typescript
// GET /api/content/subjects/

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  course_count: number;
}

const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.get('/content/subjects/');
  return response.data;
};

// React Hook
import { useQuery } from 'react-query';

const useSubjects = () => {
  return useQuery('subjects', fetchSubjects);
};

// Usage in component
const SubjectGrid = () => {
  const { data: subjects, isLoading } = useSubjects();
  
  if (isLoading) return <Loader />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {subjects?.map(subject => (
        <SubjectCard
          key={subject.id}
          name={subject.name}
          icon={subject.icon}
          color={subject.color}
          courseCount={subject.course_count}
        />
      ))}
    </div>
  );
};
```

### 2. List Courses with Filters

**Browse courses with subject, difficulty, curriculum filters**

```typescript
// GET /api/content/courses/
// Query params: subject, curriculum, exam_system, difficulty, featured

interface Course {
  id: string;
  title: string;
  description: string;
  subject: {
    name: string;
    code: string;
    color: string;
  };
  curriculum: string;
  curriculum_id: string | null;
  exam_system: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  module_count: number;
  lesson_count: number;
  thumbnail: string | null;
  created_at: string;
  is_featured: boolean;
  priority_order: number;
  course_type: string;
  is_free: boolean;
  price: string;
  currency: string;
  enrollment_deadline: string | null;
}

interface CourseFilters {
  subject?: string;
  curriculum?: string;
  exam_system?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

const fetchCourses = async (filters: CourseFilters = {}): Promise<Course[]> => {
  const params = new URLSearchParams();
  
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.curriculum) params.append('curriculum', filters.curriculum);
  if (filters.exam_system) params.append('exam_system', filters.exam_system);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.featured) params.append('featured', 'true');
  
  const response = await apiClient.get(`/content/courses/?${params}`);
  return response.data;
};

// React Hook
const useCourses = (filters: CourseFilters = {}) => {
  return useQuery(['courses', filters], () => fetchCourses(filters));
};

// Usage
const CourseList = () => {
  const [filters, setFilters] = useState<CourseFilters>({
    difficulty: 'beginner',
  });
  
  const { data: courses, isLoading } = useCourses(filters);
  
  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />
      <CourseGrid courses={courses} loading={isLoading} />
    </>
  );
};
```

### 3. Search Courses

**Full-text search across courses, modules, lessons**

```typescript
// GET /api/content/search/
// Query params: q (query), type, subject, difficulty

interface SearchResult {
  query: string;
  results: {
    courses: Array<{
      id: string;
      title: string;
      description: string;
      subject: string;
      difficulty: string;
      type: 'course';
    }>;
    modules: Array<{
      id: string;
      title: string;
      course_title: string;
      type: 'module';
    }>;
    lessons: Array<{
      id: string;
      title: string;
      module_title: string;
      course_title: string;
      type: 'lesson';
    }>;
  };
  total_results: number;
}

const searchContent = async (query: string): Promise<SearchResult> => {
  const response = await apiClient.get('/content/search/', {
    params: { q: query },
  });
  return response.data;
};

// Debounced search hook
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  
  const { data, isLoading } = useQuery(
    ['search', debouncedQuery],
    () => searchContent(debouncedQuery),
    { enabled: debouncedQuery.length > 2 }
  );
  
  return { query, setQuery, results: data, isLoading };
};
```

---

## Course Detail & Enrollment

### 1. Get Course Detail

**Full course information with modules and lessons**

```typescript
// GET /api/content/courses/{course_id}/

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  subject: {
    name: string;
    code: string;
    color: string;
  };
  program: {
    name: string;
    class_level: string;
  } | null;
  curriculum: string;
  curriculum_id: string | null;
  exam_system: string;
  difficulty: string;
  estimated_hours: number;
  thumbnail: string | null;
  is_enrolled: boolean;
  modules: Module[];
  created_at: string;
  updated_at: string;
  enrollment_deadline: string | null;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string | null;
  content_type: string;
  is_free: boolean;
  resource_count: number;
}

const fetchCourseDetail = async (courseId: string): Promise<CourseDetail> => {
  const response = await apiClient.get(`/content/courses/${courseId}/`);
  return response.data;
};

// React Hook
const useCourseDetail = (courseId: string) => {
  return useQuery(['course', courseId], () => fetchCourseDetail(courseId));
};

// Usage
const CourseDetailScreen = ({ courseId }: { courseId: string }) => {
  const { data: course, isLoading } = useCourseDetail(courseId);
  
  if (isLoading) return <Loader />;
  if (!course) return <NotFound />;
  
  return (
    <div>
      <CourseHeader course={course} />
      <CourseModules modules={course.modules} />
      {!course.is_enrolled && <EnrollButton courseId={courseId} />}
    </div>
  );
};
```

### 2. Enroll in Course

**Enroll user in a course**

```typescript
// POST /api/content/courses/{course_id}/enroll/

interface EnrollmentResponse {
  id: string;
  student: string;
  course: string;
  course_title: string;
  status: 'active';
  progress_percentage: number;
  enrolled_at: string;
  last_accessed: string | null;
}

const enrollInCourse = async (courseId: string): Promise<EnrollmentResponse> => {
  const response = await apiClient.post(`/content/courses/${courseId}/enroll/`);
  return response.data;
};

// React Hook with mutation
import { useMutation, useQueryClient } from 'react-query';

const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation(enrollInCourse, {
    onSuccess: (data, courseId) => {
      // Invalidate course detail to update is_enrolled status
      queryClient.invalidateQueries(['course', courseId]);
      queryClient.invalidateQueries('enrollments');
      
      // Show success notification
      toast.success(`Enrolled in ${data.course_title}!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Enrollment failed';
      toast.error(message);
    },
  });
};

// Usage
const EnrollButton = ({ courseId }: { courseId: string }) => {
  const { mutate: enroll, isLoading } = useEnrollCourse();
  
  return (
    <button
      onClick={() => enroll(courseId)}
      disabled={isLoading}
      className="btn-primary"
    >
      {isLoading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  );
};
```

### 3. Get User Enrollments

**List all courses user is enrolled in**

```typescript
// GET /api/content/enrollments/
// Query params: status (active, completed, dropped, suspended)

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    code: string;
    slug: string;
    description: string;
    subject: {
      id: string;
      name: string;
      code: string;
    } | null;
    curriculum: string;
    curriculum_id: string | null;
    exam_system: string;
    difficulty: string;
    estimated_hours: number;
    thumbnail: string | null;
    course_type: string;
  };
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress_percentage: number;
  enrolled_at: string;
  last_accessed: string | null;
  completion_date: string | null;
}

const fetchEnrollments = async (status?: string): Promise<Enrollment[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get('/content/enrollments/', { params });
  return response.data;
};

// React Hook
const useEnrollments = (status?: string) => {
  return useQuery(['enrollments', status], () => fetchEnrollments(status));
};

// Usage
const MyCourses = () => {
  const { data: enrollments, isLoading } = useEnrollments('active');
  
  return (
    <div className="my-courses">
      <h1>My Courses</h1>
      {enrollments?.map(enrollment => (
        <EnrollmentCard
          key={enrollment.id}
          enrollment={enrollment}
        />
      ))}
    </div>
  );
};
```

---

## Learning Flow

### 1. Get Lesson Detail

**Complete lesson with sections, quizzes, resources, and progress**

```typescript
// GET /api/content/lessons/{lesson_id}/

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  order: number;
  duration: string | null;
  content_type: string;
  difficulty: string;
  learning_objectives: string[];
  keywords: string[];
  is_free: boolean;
  is_preview: boolean;
  sections: LessonSection[];
  resources: Resource[];
  user_progress: {
    is_completed: boolean;
    completed_at: string | null;
    time_spent_minutes: number;
  } | null;
  created_at: string;
  updated_at: string;
}

interface LessonSection {
  id: string;
  order: number;
  section_type: 'video' | 'text' | 'quiz' | 'interactive' | 'reading' | 'practice' | 
                'assignment' | 'discussion' | 'exam_prep' | 'past_questions' | 
                'mock_exam' | 'study_guide' | 'exam_tips' | 'image' | 'audio' | 
                'pdf' | 'embed';
  title: string;
  text_content: string | null;
  file: string | null;
  url: string | null;
  embed_code: string | null;
  image_url: string | null;
  content_url: string | null;
  user_progress: {
    is_completed: boolean;
    progress_percentage: number;
    time_spent_seconds: number;
  } | null;
  quiz_questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  text: string;
  explanation: string;
  order: number;
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
  order: number;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: 'document' | 'video' | 'audio' | 'link' | 'image';
  file: string | null;
  file_size: number;
  duration: string | null;
  download_allowed: boolean;
  order: number;
  is_required: boolean;
  estimated_time_minutes: number;
  file_size_mb: number;
  url: string | null;
  text_content: string | null;
  embed_code: string | null;
  is_primary: boolean;
  metadata: any;
}

const fetchLessonDetail = async (lessonId: string): Promise<LessonDetail> => {
  const response = await apiClient.get(`/content/lessons/${lessonId}/`);
  return response.data;
};

// React Hook
const useLessonDetail = (lessonId: string) => {
  return useQuery(['lesson', lessonId], () => fetchLessonDetail(lessonId));
};

// Usage
const LessonScreen = ({ lessonId }: { lessonId: string }) => {
  const { data: lesson, isLoading } = useLessonDetail(lessonId);
  
  if (isLoading) return <Loader />;
  if (!lesson) return <NotFound />;
  
  return (
    <div>
      <LessonHeader lesson={lesson} />
      <LessonSections sections={lesson.sections} />
      <LessonResources resources={lesson.resources} />
      {!lesson.user_progress?.is_completed && (
        <CompleteButton lessonId={lessonId} />
      )}
    </div>
  );
};
```

### 2. Complete Lesson

**Mark lesson as complete, earn XP, unlock next content**

```typescript
// POST /api/content/lessons/{lesson_id}/complete/

interface CompleteLessonRequest {
  time_spent_minutes: number;
  metadata?: {
    quiz_score?: number;
    attempts?: number;
    completed_sections?: number;
  };
}

interface CompleteLessonResponse {
  success: boolean;
  message: string;
  xp_awarded: number;
  level_up: boolean;
  new_level: number | null;
  next_unlocked: {
    type: 'lesson' | 'module';
    id: string;
    title: string;
  } | null;
  certificate_issued: boolean;
  certificate_number: string | null;
  course_completed: boolean;
}

const completeLesson = async (
  lessonId: string,
  data: CompleteLessonRequest
): Promise<CompleteLessonResponse> => {
  const response = await apiClient.post(
    `/content/lessons/${lessonId}/complete/`,
    data
  );
  return response.data;
};

// React Hook
const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ lessonId, data }: { lessonId: string; data: CompleteLessonRequest }) =>
      completeLesson(lessonId, data),
    {
      onSuccess: (response, { lessonId }) => {
        // Invalidate queries
        queryClient.invalidateQueries(['lesson', lessonId]);
        queryClient.invalidateQueries('progress');
        queryClient.invalidateQueries('enrollments');
        
        // Show success with XP
        toast.success(
          `✅ Lesson completed! +${response.xp_awarded} XP`,
          {
            icon: response.level_up ? '🎉' : '✅',
          }
        );
        
        // Handle certificate issued
        if (response.certificate_issued) {
          toast.success('🎓 Certificate earned!', {
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => navigate(`/certificates/${response.certificate_number}`),
            },
          });
        }
      },
    }
  );
};

// Usage
const LessonCompleteButton = ({ lessonId }: { lessonId: string }) => {
  const { mutate: complete, isLoading } = useCompleteLesson();
  const [timeSpent, setTimeSpent] = useState(0);
  
  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const handleComplete = () => {
    complete({
      lessonId,
      data: {
        time_spent_minutes: timeSpent,
        metadata: {
          completed_sections: 5,
        },
      },
    });
  };
  
  return (
    <button onClick={handleComplete} disabled={isLoading}>
      {isLoading ? 'Completing...' : 'Mark as Complete'}
    </button>
  );
};
```

### 3. Complete Section

**Track section-level completion (videos, quizzes, etc.)**

```typescript
// POST /api/content/sections/{section_id}/complete/

interface CompleteSectionRequest {
  time_spent_seconds: number;
  metadata?: {
    video_completed?: boolean;
    quiz_score?: number;
  };
}

const completeSection = async (
  sectionId: string,
  data: CompleteSectionRequest
): Promise<{ success: boolean; message: string; progress_percentage: number }> => {
  const response = await apiClient.post(
    `/content/sections/${sectionId}/complete/`,
    data
  );
  return response.data;
};

// Usage in video player
const VideoPlayer = ({ section }: { section: LessonSection }) => {
  const [watchTime, setWatchTime] = useState(0);
  const { mutate: completeSection } = useMutation(completeSection);
  
  const handleVideoEnd = () => {
    completeSection({
      sectionId: section.id,
      data: {
        time_spent_seconds: watchTime,
        metadata: {
          video_completed: true,
        },
      },
    });
  };
  
  return (
    <video
      src={section.content_url}
      onTimeUpdate={(e) => setWatchTime(e.currentTarget.currentTime)}
      onEnded={handleVideoEnd}
    />
  );
};
```

---

## Progress Tracking

### 1. Course Progress Detail

**Complete progress breakdown for a course**

```typescript
// GET /api/content/progress/courses/{course_id}/

interface CourseProgress {
  course: {
    id: string;
    title: string;
  };
  enrollment: {
    id: string;
    status: string;
    enrolled_at: string;
  };
  overall_progress: number;
  modules_completed: number;
  modules_total: number;
  lessons_completed: number;
  lessons_total: number;
  time_spent_hours: number;
  current_position: {
    module: {
      id: string;
      title: string;
    } | null;
    lesson: {
      id: string;
      title: string;
    } | null;
  };
  modules: ModuleProgress[];
}

interface ModuleProgress {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
  completed_at: string | null;
  progress_percentage: number;
  lessons: LessonProgressItem[];
}

interface LessonProgressItem {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
}

const fetchCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  const response = await apiClient.get(`/content/progress/courses/${courseId}/`);
  return response.data;
};

// React Hook
const useCourseProgress = (courseId: string) => {
  return useQuery(['course-progress', courseId], () => fetchCourseProgress(courseId));
};

// Usage - Progress Dashboard
const CourseProgressDashboard = ({ courseId }: { courseId: string }) => {
  const { data: progress, isLoading } = useCourseProgress(courseId);
  
  if (isLoading) return <Loader />;
  
  return (
    <div className="progress-dashboard">
      <ProgressHeader
        percentage={progress.overall_progress}
        completedLessons={progress.lessons_completed}
        totalLessons={progress.lessons_total}
      />
      
      <div className="modules-list">
        {progress.modules.map(module => (
          <ModuleProgressCard key={module.id} module={module} />
        ))}
      </div>
      
      {progress.current_position.lesson && (
        <ContinueLearningButton
          lessonId={progress.current_position.lesson.id}
          lessonTitle={progress.current_position.lesson.title}
        />
      )}
    </div>
  );
};
```

### 2. Update Course Position

**Bookmark user's current position in a course**

```typescript
// POST /api/content/progress/courses/{course_id}/update-position/

interface UpdatePositionRequest {
  current_module?: string;
  current_lesson?: string;
}

const updateCoursePosition = async (
  courseId: string,
  data: UpdatePositionRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(
    `/content/progress/courses/${courseId}/update-position/`,
    data
  );
  return response.data;
};

// Auto-update position when user starts a lesson
const LessonViewer = ({ lesson }: { lesson: LessonDetail }) => {
  const { mutate: updatePosition } = useMutation(updateCoursePosition);
  
  useEffect(() => {
    // Update position when lesson loads
    updatePosition({
      courseId: lesson.module.course.id,
      data: {
        current_module: lesson.module.id,
        current_lesson: lesson.id,
      },
    });
  }, [lesson.id]);
  
  return <LessonContent lesson={lesson} />;
};
```

### 3. User Progress Overview

**Overall progress across all courses**

```typescript
// GET /api/content/progress/

interface UserProgress {
  total_courses: number;
  active_courses: number;
  completed_courses: number;
  total_lessons_completed: number;
  total_time_spent_hours: number;
  current_streak_days: number;
  recent_activity: Array<{
    course_title: string;
    lesson_title: string;
    completed_at: string;
    xp_earned: number;
  }>;
}

const fetchUserProgress = async (): Promise<UserProgress> => {
  const response = await apiClient.get('/content/progress/');
  return response.data;
};

// Usage - Dashboard
const DashboardStats = () => {
  const { data: progress } = useQuery('user-progress', fetchUserProgress);
  
  return (
    <div className="stats-grid">
      <StatCard
        label="Active Courses"
        value={progress?.active_courses}
        icon="📚"
      />
      <StatCard
        label="Completed"
        value={progress?.completed_courses}
        icon="✅"
      />
      <StatCard
        label="Study Streak"
        value={`${progress?.current_streak_days} days`}
        icon="🔥"
      />
      <StatCard
        label="Total Hours"
        value={progress?.total_time_spent_hours}
        icon="⏱️"
      />
    </div>
  );
};
```

---

## Certificates

### 1. Request Certificate

**Request certificate after completing all lessons**

```typescript
// POST /api/content/courses/{course_id}/request-certificate/

interface CertificateResponse {
  message: string;
  certificate: {
    id: string;
    certificate_number: string;
    issued_date: string;
    pdf_file: string | null;
    is_verified: boolean;
    final_grade: number | null;
    student_name: string;
    student_email: string;
    course_title: string;
    course_code: string;
    created_at: string;
  };
  xp_earned: number;
}

const requestCertificate = async (courseId: string): Promise<CertificateResponse> => {
  const response = await apiClient.post(
    `/content/courses/${courseId}/request-certificate/`
  );
  return response.data;
};

// React Hook
const useRequestCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation(requestCertificate, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('certificates');
      toast.success('🎓 Certificate issued!');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.completion_percentage < 100) {
        toast.error(
          `Complete ${errorData.total_lessons - errorData.completed_lessons} more lessons to earn certificate`
        );
      } else {
        toast.error(errorData?.error || 'Failed to issue certificate');
      }
    },
  });
};

// Usage
const RequestCertificateButton = ({ courseId, progress }: { 
  courseId: string; 
  progress: number; 
}) => {
  const { mutate: requestCert, isLoading } = useRequestCertificate();
  
  if (progress < 100) {
    return (
      <button disabled className="btn-disabled">
        Complete all lessons to earn certificate
      </button>
    );
  }
  
  return (
    <button
      onClick={() => requestCert(courseId)}
      disabled={isLoading}
      className="btn-success"
    >
      {isLoading ? 'Processing...' : '🎓 Request Certificate'}
    </button>
  );
};
```

### 2. View User Certificates

**List all earned certificates**

```typescript
// GET /api/content/certificates/

interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  pdf_file: string | null;
  is_verified: boolean;
  final_grade: number | null;
  student_name: string;
  student_email: string;
  course_title: string;
  course_code: string;
  created_at: string;
}

const fetchCertificates = async (): Promise<Certificate[]> => {
  const response = await apiClient.get('/content/certificates/');
  return response.data;
};

// React Hook
const useCertificates = () => {
  return useQuery('certificates', fetchCertificates);
};

// Usage
const CertificatesScreen = () => {
  const { data: certificates, isLoading } = useCertificates();
  
  if (isLoading) return <Loader />;
  
  if (!certificates || certificates.length === 0) {
    return (
      <EmptyState
        icon="🎓"
        title="No certificates yet"
        description="Complete courses to earn certificates"
      />
    );
  }
  
  return (
    <div className="certificates-grid">
      {certificates.map(cert => (
        <CertificateCard
          key={cert.id}
          certificate={cert}
          onView={() => navigate(`/certificates/${cert.certificate_number}`)}
          onDownload={() => window.open(cert.pdf_file, '_blank')}
          onShare={() => shareCertificate(cert.certificate_number)}
        />
      ))}
    </div>
  );
};
```

### 3. View Certificate

**View certificate details**

```typescript
// GET /api/content/certificates/{certificate_number}/

const fetchCertificate = async (
  certificateNumber: string
): Promise<Certificate> => {
  const response = await apiClient.get(`/content/certificates/${certificateNumber}/`);
  return response.data;
};

// Certificate viewer
const CertificateViewer = ({ certificateNumber }: { certificateNumber: string }) => {
  const { data: cert, isLoading } = useQuery(
    ['certificate', certificateNumber],
    () => fetchCertificate(certificateNumber)
  );
  
  if (isLoading) return <Loader />;
  
  return (
    <div className="certificate-viewer">
      <div className="certificate-card">
        <h1>Certificate of Completion</h1>
        <p>This certifies that</p>
        <h2>{cert.student_name}</h2>
        <p>has successfully completed</p>
        <h3>{cert.course_title}</h3>
        <p>Certificate Number: {cert.certificate_number}</p>
        <p>Issued: {new Date(cert.issued_date).toLocaleDateString()}</p>
        {cert.final_grade && <p>Final Grade: {cert.final_grade}%</p>}
      </div>
      
      <div className="certificate-actions">
        {cert.pdf_file && (
          <button onClick={() => window.open(cert.pdf_file, '_blank')}>
            📄 Download PDF
          </button>
        )}
        <button onClick={() => shareCertificate(cert.certificate_number)}>
          📤 Share
        </button>
        <button onClick={() => navigate(`/certificates/${cert.certificate_number}/verify`)}>
          ✅ Verify
        </button>
      </div>
    </div>
  );
};
```

### 4. Verify Certificate (Public)

**Verify certificate authenticity - No auth required**

```typescript
// GET /api/content/certificates/{certificate_number}/verify/

interface CertificateVerification {
  valid: boolean;
  certificate_number?: string;
  student_name?: string;
  course_title?: string;
  course_code?: string;
  issued_date?: string;
  final_grade?: number | null;
  is_verified?: boolean;
  message?: string;
}

const verifyCertificate = async (
  certificateNumber: string
): Promise<CertificateVerification> => {
  const response = await axios.get(
    `/api/content/certificates/${certificateNumber}/verify/`
  );
  return response.data;
};

// Public verification page
const CertificateVerificationPage = () => {
  const [certNumber, setCertNumber] = useState('');
  const { data, isLoading, refetch } = useQuery(
    ['verify-certificate', certNumber],
    () => verifyCertificate(certNumber),
    { enabled: false }
  );
  
  const handleVerify = () => {
    if (certNumber.length > 0) {
      refetch();
    }
  };
  
  return (
    <div className="verify-certificate">
      <h1>Verify Certificate</h1>
      <input
        type="text"
        placeholder="Enter certificate number"
        value={certNumber}
        onChange={(e) => setCertNumber(e.target.value)}
      />
      <button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
      
      {data && (
        <div className={`result ${data.valid ? 'valid' : 'invalid'}`}>
          {data.valid ? (
            <>
              <h2>✅ Valid Certificate</h2>
              <p>Student: {data.student_name}</p>
              <p>Course: {data.course_title}</p>
              <p>Issued: {new Date(data.issued_date!).toLocaleDateString()}</p>
              {data.final_grade && <p>Grade: {data.final_grade}%</p>}
            </>
          ) : (
            <>
              <h2>❌ Invalid Certificate</h2>
              <p>{data.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## Reviews & Ratings

### 1. List Course Reviews

```typescript
// GET /api/content/courses/{course_id}/reviews/

interface Review {
  id: string;
  student: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

const fetchCourseReviews = async (courseId: string): Promise<Review[]> => {
  const response = await apiClient.get(`/content/courses/${courseId}/reviews/`);
  return response.data;
};

// Usage
const CourseReviews = ({ courseId }: { courseId: string }) => {
  const { data: reviews } = useQuery(['reviews', courseId], () =>
    fetchCourseReviews(courseId)
  );
  
  return (
    <div className="reviews">
      {reviews?.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
```

### 2. Create Review

```typescript
// POST /api/content/courses/{course_id}/reviews/create/

interface CreateReviewRequest {
  rating: number; // 1-5
  comment: string;
}

const createReview = async (
  courseId: string,
  data: CreateReviewRequest
): Promise<Review> => {
  const response = await apiClient.post(
    `/content/courses/${courseId}/reviews/create/`,
    data
  );
  return response.data;
};

// Usage
const ReviewForm = ({ courseId }: { courseId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  
  const { mutate: submitReview, isLoading } = useMutation(
    () => createReview(courseId, { rating, comment }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', courseId]);
        toast.success('Review submitted!');
      },
    }
  );
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); submitReview(); }}>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
      />
      <button type="submit" disabled={isLoading}>
        Submit Review
      </button>
    </form>
  );
};
```

---

## Complete User Flows

### Flow 1: Browse & Enroll

```typescript
const BrowseToEnrollFlow = () => {
  // 1. List subjects
  const { data: subjects } = useSubjects();
  
  // 2. Filter courses by subject
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const { data: courses } = useCourses({ subject: selectedSubject });
  
  // 3. View course detail
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const { data: courseDetail } = useCourseDetail(selectedCourse!);
  
  // 4. Enroll
  const { mutate: enroll } = useEnrollCourse();
  
  return (
    <Wizard>
      <Step1>
        <SubjectGrid
          subjects={subjects}
          onSelect={setSelectedSubject}
        />
      </Step1>
      
      <Step2>
        <CourseList
          courses={courses}
          onSelect={setSelectedCourse}
        />
      </Step2>
      
      <Step3>
        <CourseDetail
          course={courseDetail}
          onEnroll={() => enroll(selectedCourse!)}
        />
      </Step3>
    </Wizard>
  );
};
```

### Flow 2: Learn & Complete

```typescript
const LearnAndCompleteFlow = () => {
  const { courseId } = useParams();
  
  // 1. Get course progress
  const { data: progress } = useCourseProgress(courseId);
  
  // 2. Continue from current position or start first lesson
  const currentLessonId = progress?.current_position?.lesson?.id ||
                          progress?.modules[0]?.lessons[0]?.id;
  
  // 3. Load lesson
  const { data: lesson } = useLessonDetail(currentLessonId);
  
  // 4. Track time and complete
  const [timeSpent, setTimeSpent] = useState(0);
  const { mutate: completeLesson } = useCompleteLesson();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const handleComplete = () => {
    completeLesson({
      lessonId: currentLessonId,
      data: { time_spent_minutes: timeSpent },
    });
  };
  
  return (
    <LessonViewer
      lesson={lesson}
      onComplete={handleComplete}
      progress={progress}
    />
  );
};
```

### Flow 3: Complete Course & Get Certificate

```typescript
const CompleteCourseFlow = () => {
  const { courseId } = useParams();
  
  // 1. Check progress
  const { data: progress } = useCourseProgress(courseId);
  
  // 2. Show completion status
  const isCompleted = progress?.overall_progress === 100;
  
  // 3. Request certificate
  const { mutate: requestCert } = useRequestCertificate();
  
  // 4. View certificate
  const { data: certificates } = useCertificates();
  const courseCert = certificates?.find(c => 
    c.course_title === progress?.course.title
  );
  
  return (
    <div>
      <ProgressCircle percentage={progress?.overall_progress} />
      
      {isCompleted ? (
        courseCert ? (
          <CertificateCard
            certificate={courseCert}
            onView={() => navigate(`/certificates/${courseCert.certificate_number}`)}
          />
        ) : (
          <button onClick={() => requestCert(courseId)}>
            Request Certificate
          </button>
        )
      ) : (
        <ContinueLearningButton
          lessonId={progress?.current_position?.lesson?.id}
        />
      )}
    </div>
  );
};
```

---

## TypeScript Types

```typescript
// types/content.ts

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  course_count: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: {
    name: string;
    code: string;
    color: string;
  };
  curriculum: string;
  curriculum_id: string | null;
  exam_system: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  module_count: number;
  lesson_count: number;
  thumbnail: string | null;
  created_at: string;
  is_featured: boolean;
  priority_order: number;
  course_type: string;
  is_free: boolean;
  price: string;
  currency: string;
  enrollment_deadline: string | null;
}

export interface CourseDetail extends Course {
  program: {
    name: string;
    class_level: string;
  } | null;
  is_enrolled: boolean;
  modules: Module[];
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string | null;
  content_type: string;
  is_free: boolean;
  resource_count: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  order: number;
  duration: string | null;
  content_type: string;
  difficulty: string;
  learning_objectives: string[];
  keywords: string[];
  is_free: boolean;
  is_preview: boolean;
  sections: LessonSection[];
  resources: Resource[];
  user_progress: {
    is_completed: boolean;
    completed_at: string | null;
    time_spent_minutes: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export type SectionType = 
  | 'video' | 'text' | 'quiz' | 'interactive' | 'reading' | 'practice'
  | 'assignment' | 'discussion' | 'exam_prep' | 'past_questions'
  | 'mock_exam' | 'study_guide' | 'exam_tips' | 'image' | 'audio'
  | 'pdf' | 'embed';

export interface LessonSection {
  id: string;
  order: number;
  section_type: SectionType;
  title: string;
  text_content: string | null;
  file: string | null;
  url: string | null;
  embed_code: string | null;
  image_url: string | null;
  content_url: string | null;
  user_progress: {
    is_completed: boolean;
    progress_percentage: number;
    time_spent_seconds: number;
  } | null;
  quiz_questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  explanation: string;
  order: number;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
  order: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: 'document' | 'video' | 'audio' | 'link' | 'image';
  file: string | null;
  file_size: number;
  duration: string | null;
  download_allowed: boolean;
  order: number;
  is_required: boolean;
  estimated_time_minutes: number;
  file_size_mb: number;
  url: string | null;
  text_content: string | null;
  embed_code: string | null;
  is_primary: boolean;
  metadata: any;
}

export interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    code: string;
    slug: string;
    description: string;
    subject: {
      id: string;
      name: string;
      code: string;
    } | null;
    curriculum: string;
    curriculum_id: string | null;
    exam_system: string;
    difficulty: string;
    estimated_hours: number;
    thumbnail: string | null;
    course_type: string;
  };
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress_percentage: number;
  enrolled_at: string;
  last_accessed: string | null;
  completion_date: string | null;
}

export interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  pdf_file: string | null;
  is_verified: boolean;
  final_grade: number | null;
  student_name: string;
  student_email: string;
  course_title: string;
  course_code: string;
  created_at: string;
}

export interface CourseProgress {
  course: {
    id: string;
    title: string;
  };
  enrollment: {
    id: string;
    status: string;
    enrolled_at: string;
  };
  overall_progress: number;
  modules_completed: number;
  modules_total: number;
  lessons_completed: number;
  lessons_total: number;
  time_spent_hours: number;
  current_position: {
    module: {
      id: string;
      title: string;
    } | null;
    lesson: {
      id: string;
      title: string;
    } | null;
  };
  modules: ModuleProgress[];
}

export interface ModuleProgress {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
  completed_at: string | null;
  progress_percentage: number;
  lessons: LessonProgressItem[];
}

export interface LessonProgressItem {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
}

export interface Review {
  id: string;
  student: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}
```

---

## React Hooks

```typescript
// hooks/useContent.ts

export const useSubjects = () => {
  return useQuery('subjects', fetchSubjects);
};

export const useCourses = (filters: CourseFilters = {}) => {
  return useQuery(['courses', filters], () => fetchCourses(filters));
};

export const useCourseDetail = (courseId: string) => {
  return useQuery(['course', courseId], () => fetchCourseDetail(courseId), {
    enabled: !!courseId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation(enrollInCourse, {
    onSuccess: (data, courseId) => {
      queryClient.invalidateQueries(['course', courseId]);
      queryClient.invalidateQueries('enrollments');
    },
  });
};

export const useEnrollments = (status?: string) => {
  return useQuery(['enrollments', status], () => fetchEnrollments(status));
};

export const useLessonDetail = (lessonId: string) => {
  return useQuery(['lesson', lessonId], () => fetchLessonDetail(lessonId), {
    enabled: !!lessonId,
  });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ lessonId, data }: { lessonId: string; data: CompleteLessonRequest }) =>
      completeLesson(lessonId, data),
    {
      onSuccess: (response, { lessonId }) => {
        queryClient.invalidateQueries(['lesson', lessonId]);
        queryClient.invalidateQueries('progress');
        queryClient.invalidateQueries('enrollments');
      },
    }
  );
};

export const useCourseProgress = (courseId: string) => {
  return useQuery(['course-progress', courseId], () => fetchCourseProgress(courseId), {
    enabled: !!courseId,
  });
};

export const useRequestCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation(requestCertificate, {
    onSuccess: () => {
      queryClient.invalidateQueries('certificates');
    },
  });
};

export const useCertificates = () => {
  return useQuery('certificates', fetchCertificates);
};
```

---

## Error Handling

```typescript
// utils/errorHandler.ts

export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data.error || 'Invalid request';
      case 401:
        // Redirect to login
        window.location.href = '/login';
        return 'Please login to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return data.error || 'Resource not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return data.error || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection';
  } else {
    // Something else happened
    return error.message || 'An error occurred';
  }
};

// Global error boundary
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        const message = handleApiError(error);
        toast.error(message);
      },
    },
    mutations: {
      onError: (error) => {
        const message = handleApiError(error);
        toast.error(message);
      },
    },
  },
});
```

---

## Offline Support

```typescript
// utils/offlineStorage.ts

import localforage from 'localforage';

// Cache course data for offline access
export const cacheForOffline = async (courseId: string) => {
  try {
    // Fetch all course data
    const course = await fetchCourseDetail(courseId);
    const progress = await fetchCourseProgress(courseId);
    
    // Store in IndexedDB
    await localforage.setItem(`course_${courseId}`, course);
    await localforage.setItem(`progress_${courseId}`, progress);
    
    // Download lessons
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const lessonDetail = await fetchLessonDetail(lesson.id);
        await localforage.setItem(`lesson_${lesson.id}`, lessonDetail);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to cache course:', error);
    return false;
  }
};

// Load from offline cache
export const loadFromCache = async (courseId: string) => {
  try {
    const course = await localforage.getItem(`course_${courseId}`);
    return course;
  } catch (error) {
    console.error('Failed to load from cache:', error);
    return null;
  }
};

// Sync offline progress when online
export const syncOfflineProgress = async () => {
  const offlineProgress = await localforage.getItem('offline_progress');
  
  if (!offlineProgress) return;
  
  // TODO: Sync with server
  // Clear offline progress after sync
  await localforage.removeItem('offline_progress');
};
```

---

## Best Practices

### 1. Performance Optimization

```typescript
// Prefetch next lesson
const usePrefetchNextLesson = (currentLessonId: string) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Get next lesson ID from progress
    // Prefetch it
    queryClient.prefetchQuery(['lesson', nextLessonId], () =>
      fetchLessonDetail(nextLessonId)
    );
  }, [currentLessonId]);
};

// Lazy load images
const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
};
```

### 2. Analytics Tracking

```typescript
// Track page views
const trackPageView = (page: string) => {
  // Google Analytics
  gtag('event', 'page_view', { page_path: page });
  
  // Custom analytics
  apiClient.post('/api/analytics/track/', {
    event_type: 'page_view',
    page,
    timestamp: new Date().toISOString(),
  });
};

// Track lesson completion
const trackLessonComplete = (lessonId: string, timeSpent: number) => {
  apiClient.post('/api/analytics/track/', {
    event_type: 'lesson_complete',
    lesson_id: lessonId,
    time_spent_minutes: timeSpent,
    timestamp: new Date().toISOString(),
  });
};
```

### 3. State Management

```typescript
// Use Zustand for global state
import create from 'zustand';

interface AppState {
  currentCourse: Course | null;
  setCurrentCourse: (course: Course | null) => void;
  currentLesson: LessonDetail | null;
  setCurrentLesson: (lesson: LessonDetail | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentCourse: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),
  currentLesson: null,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
}));
```

---

## Testing

```typescript
// __tests__/useCourses.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useCourses } from '../hooks/useContent';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCourses', () => {
  it('fetches courses successfully', async () => {
    const { result } = renderHook(() => useCourses(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
```

---

## ZlearnWeb Frontend Implementation (Content / Academic)

The ZlearnWeb app wires the Content API for **academic** users as follows:

| Area | Implementation |
|------|----------------|
| **Course list / detail** | `coursesService.getAvailable('academic')` → `/content/courses/`; `getCourseDetails(id, 'academic')` → `/content/courses/{id}/` (when ID is UUID). |
| **Enrollments** | `getEnrolled('academic')` → `/content/enrollments/`; normalized for both flat and nested `course` shape. |
| **Enroll** | `enrollInCourse(courseId, 'academic')` → `POST /content/courses/{courseId}/enroll/`. |
| **Course progress** | `getCourseProgress(courseId, 'academic')` → `GET /content/progress/courses/{id}/`. |
| **Lesson detail** | `getLessonDetails(lessonId, undefined, false)` for academic → `GET /content/lessons/{id}/`. |
| **Complete lesson** | `completeLesson(lessonId, body, false)` → `POST /content/lessons/{id}/complete/` with `time_spent_minutes` and optional `metadata`. |
| **Update position** | `updateCoursePosition(courseId, data, 'academic')` → `POST /content/progress/courses/{id}/update-position/`. |
| **Reviews** | `getCourseReviews` / `createCourseReview` with `userType === 'academic'` → `/content/courses/{id}/reviews/` and `POST .../reviews/create/`. |
| **Certificates (list)** | `fetchCertificates()` uses `getContentCertificates()` when user is academic → `GET /content/certificates/`. |
| **Request certificate** | Use `coursesService.requestContentCertificate(courseId)` for academic. |
| **Verify certificate (public)** | `verifyCertificateAny(certificateNumber)` tries `GET /content/certificates/{number}/verify/` first, then professional endpoint. |
| **Section complete** | `completeContentSection(sectionId, { time_spent_seconds, metadata })` → `POST /content/sections/{id}/complete/`. |
| **Progress overview** | `getContentProgressOverview()` → `GET /content/progress/`. |
| **Lesson progress (no complete)** | `updateLessonProgressContent(lessonId, data)` → `POST /content/lessons/{id}/progress/`. |
| **Search** | `searchContent(query, params)` → `GET /content/search/?q=...`. |
| **Subjects** | `getSubjects()` → `GET /content/subjects/`. |

Lesson and section types from the guide (`section_type`, `content_type`, `resource_type`) are supported in `LessonSectionBlock` and resource rendering (including `url` / `link` for resources and video from `content_url` / `video_url`).

---

## Support

**Documentation**: https://docs.zlearn.com/api/content  
**Email**: api-support@zlearn.com  
**Discord**: https://discord.gg/zlearn-dev  
**GitHub**: https://github.com/zlearn/frontend-sdk

---

**Last Updated**: March 3, 2026  
**Contributors**: ZiloTech Development Team
