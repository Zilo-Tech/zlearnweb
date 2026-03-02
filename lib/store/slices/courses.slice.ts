import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesService } from '@/lib/services/courses.service';
import type { Course } from '@/lib/types';

export type CourseProgressRecord = Record<string, { progress_percentage?: number }>;

interface CoursesState {
  enrolled: Course[];
  available: Course[];
  featured: Course[];
  currentCourse: Course | null;
  progress: CourseProgressRecord | null;
  enrolledCourseIds: string[];
  userType: 'academic' | 'professional' | 'exams' | null;
  /** Lessons fetched via /enhanced/lessons/?module= - when course detail has modules without lessons */
  moduleLessonsByModuleId: Record<string, unknown[]>;
  /** Certificates earned by the user */
  certificates: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  enrolled: [],
  available: [],
  featured: [],
  currentCourse: null,
  progress: null,
  enrolledCourseIds: [],
  userType: null,
  moduleLessonsByModuleId: {},
  certificates: [],
  isLoading: false,
  error: null,
};

/** Normalize professional API enrollment format to Course[] shape */
function normalizeEnrolled(raw: unknown): Course[] {
  const arr = Array.isArray(raw) ? raw : (raw as { results?: unknown[] })?.results ?? [];
  return arr.map((item: any) => {
    if (!item) return item;
    // API: course=uuid, course_title, course_slug (flat) OR course={ id, title, slug } (nested)
    if (typeof item.course === 'object') {
      return { ...item.course, progress_percentage: item.progress_percentage, completed_lessons: item.completed_lessons };
    }
    return {
      id: item.course,
      title: item.course_title,
      slug: item.course_slug,
      progress_percentage: item.progress_percentage,
      completed_lessons: item.completed_lessons ?? [],
      ...item,
    } as Course & { completed_lessons?: string[] };
  }) as Course[];
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async (
    opts: { forceProfessional?: boolean } | void,
    { getState }
  ) => {
    const state = getState() as { auth: { user: { user_type?: string } | null } };
    const userType = state.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null;
    const effectiveType = opts?.forceProfessional ? 'professional' : userType;
    const data = await coursesService.getEnrolled(effectiveType);
    return normalizeEnrolled(data);
  }
);

export const fetchAvailableCourses = createAsyncThunk(
  'courses/fetchAvailable',
  async (_, { getState }) => {
    const state = getState() as { auth: { user: { user_type?: string } | null } };
    const userType = state.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null;
    const data = await coursesService.getAvailable(userType);
    const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
    return list;
  }
);

export const fetchFeaturedCourses = createAsyncThunk(
  'courses/fetchFeatured',
  async (_, { getState }) => {
    const state = getState() as { auth: { user: { user_type?: string } | null } };
    const userType = state.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null;
    const data = await coursesService.getFeatured(userType);
    const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
    return list;
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'courses/fetchDetails',
  async (idOrSlug: string, { getState }) => {
    const state = getState() as { auth: { user: { user_type?: string } | null } };
    const userType = state.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null;
    return coursesService.getCourseDetails(idOrSlug, userType) as Promise<Course>;
  }
);

/** Fetch lessons for modules that don't have them (via enhanced/lessons endpoint) */
export const fetchModuleLessons = createAsyncThunk(
  'courses/fetchModuleLessons',
  async (moduleIds: string[]) => {
    const entries = await Promise.all(
      moduleIds.map(async (id) => {
        const data = await coursesService.getEnhancedLessons(id);
        const list = Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
        return [id, list] as const;
      })
    );
    return Object.fromEntries(entries);
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async (
    arg: { identifier: string; courseId: string } | string,
    { getState }
  ) => {
    const state = getState() as { auth: { user: { user_type?: string } | null } };
    const userType = state.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null;
    const payload =
      typeof arg === 'string'
        ? { identifier: arg, courseId: arg }
        : arg;
    await coursesService.enrollInCourse(payload.courseId, userType);
    return payload.courseId; // Return UUID for enrolledCourseIds
  }
);

export const fetchCertificates = createAsyncThunk(
  'courses/fetchCertificates',
  async () => coursesService.getCertificates()
);

export const markLessonComplete = createAsyncThunk(
  'courses/markLessonComplete',
  async (
    {
      courseId,
      lessonId,
      isProfessionalCourse,
      timeSpentMinutes,
    }: {
      courseId: string;
      lessonId: string;
      isProfessionalCourse?: boolean;
      timeSpentMinutes?: number;
    }
  ) => {
    let apiResponse: {
      certificate_issued?: boolean;
      certificate_number?: string;
      course_completed?: boolean;
      xp_awarded?: number;
      xp_earned?: number;
    } = {};
    if (isProfessionalCourse) {
      apiResponse = (await coursesService.completeLesson(lessonId, {
        time_spent_minutes: timeSpentMinutes,
      })) as typeof apiResponse;
    }
    return { courseId, lessonId, ...apiResponse };
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Enrolled courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolled = (action.payload ?? []) as Course[];
        state.enrolledCourseIds = state.enrolled.map((c) => c.id);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load enrolled courses';
        state.enrolled = [];
      })
      // Available courses
      .addCase(fetchAvailableCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.available = (action.payload ?? []) as Course[];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAvailableCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load available courses';
        state.available = [];
      })
      // Featured courses
      .addCase(fetchFeaturedCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featured = (action.payload ?? []) as Course[];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeaturedCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load featured courses';
        state.featured = [];
      })
      // Course details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.currentCourse = action.payload as Course;
        state.moduleLessonsByModuleId = {};
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load course details';
      })
      // Enroll in course
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        if (action.payload && !state.enrolledCourseIds.includes(action.payload)) {
          state.enrolledCourseIds.push(action.payload);
        }
      })
      // Module lessons (from enhanced/lessons)
      .addCase(fetchModuleLessons.fulfilled, (state, action) => {
        state.moduleLessonsByModuleId = { ...state.moduleLessonsByModuleId, ...action.payload };
      })
      // Certificates
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = (action.payload ?? []) as unknown[];
      })
      // Mark lesson complete
      .addCase(markLessonComplete.fulfilled, () => {
        // Progress is tracked server-side; certificate handling done in component
      });
  },
});

// Selectors
export const selectCurrentCourse = (state: { courses: CoursesState }) => state.courses.currentCourse;

const LESSON_TYPE_MAP: Record<string, 'video' | 'text' | 'quiz'> = {
  video: 'video',
  text: 'text',
  quiz: 'quiz',
  assignment: 'text',
  interactive: 'video',
  live: 'video',
};

/** Transform API modules/lessons to ModuleList format and merge completed_lessons from enrollment */
export const selectCurrentCourseModules = (state: { courses: CoursesState }): {
  id: string;
  title: string;
  lessons: { id: string; title: string; type: 'video' | 'text' | 'quiz'; duration: string; isCompleted: boolean; isLocked: boolean }[];
}[] => {
  const course = state.courses.currentCourse;
  const rawModules = course?.modules ?? (course as any)?.curriculum;
  const modules = Array.isArray(rawModules) ? rawModules : [];
  if (modules.length === 0) return [];

  const courseId = course?.id;
  const enrollment = courseId
    ? (state.courses.enrolled as (Course & { completed_lessons?: string[] })[]).find((e) => e.id === courseId)
    : null;
  const completedLessonIds = new Set(enrollment?.completed_lessons ?? []);

  const moduleLessons = state.courses.moduleLessonsByModuleId;

  return modules.map((mod: any) => {
    const rawLessons =
      mod.lessons ?? mod.sections ?? moduleLessons[mod.id] ?? [];
    return {
      id: mod.id,
      title: mod.title ?? mod.name ?? 'Module',
      lessons: rawLessons.map((les: any) => {
        const rawType = les.lesson_type ?? les.type ?? 'text';
        return {
          id: les.id,
          title: les.title ?? les.name ?? 'Lesson',
          type: LESSON_TYPE_MAP[rawType] ?? 'text',
          duration: les.duration_minutes != null ? `${les.duration_minutes} min` : les.duration ?? '—',
          isCompleted: completedLessonIds.has(les.id),
          isLocked: false,
        };
      }),
    };
  });
};
export const selectIsEnrolled = (courseIdOrSlug: string) => (state: { courses: CoursesState }) => {
  if (state.courses.enrolledCourseIds.includes(courseIdOrSlug)) return true;
  const enrolled = state.courses.enrolled as (Course & { slug?: string })[];
  return enrolled?.some((e) => e.slug === courseIdOrSlug) ?? false;
};

export default coursesSlice.reducer;
