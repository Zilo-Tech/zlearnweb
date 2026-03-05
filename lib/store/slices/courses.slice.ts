import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCourseService, UserCourseType } from '@/lib/services/courses.service';
import type { Course } from '@/lib/types';

export type CourseProgressRecord = Record<string, { progress_percentage?: number }>;

interface CoursesState {
  enrolled: Course[];
  available: Course[];
  featured: Course[];
  currentCourse: Course | null;
  progress: CourseProgressRecord | null;
  enrolledCourseIds: string[];
  userType: UserCourseType;
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
  isLoading: false,
  error: null,
};

// Each thunk receives the current userType so it calls the right endpoint
export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async (userType: UserCourseType, { rejectWithValue }) => {
    try {
      const svc = getCourseService(userType);
      const data = await svc.getEnrolled();
      const list = Array.isArray(data) ? data : (data as any)?.results ?? [];
      // Normalize enrolled entries:
      // - Academic: { id, course: { id, slug, title, ... }, status, progress_percentage, ... }
      // - Professional: { id, course_title, course_slug, course (UUID), status, ... }
      return list.map((item: any) => {
        if (item.course && typeof item.course === 'object') {
          // Academic nested object
          return {
            ...item.course,
            enrollment_id: item.id,
            enrollment_status: item.status,
            progress_percentage: item.progress_percentage,
            progress: item.progress_percentage,
            enrolled_at: item.enrolled_at,
            is_enrolled: true,
            user_type: userType ?? 'academic',
          };
        }
        if (item.course_title || item.course_slug) {
          // Professional flat object
          return {
            ...item,
            id: String(item.course || item.id),
            title: item.course_title || item.title,
            slug: item.course_slug || item.slug,
            is_enrolled: true,
            user_type: userType ?? 'professional',
          };
        }
        return { ...item, is_enrolled: true, user_type: userType ?? 'academic' };
      }) as Course[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to load enrolled courses');
    }
  }
);

export const fetchAvailableCourses = createAsyncThunk(
  'courses/fetchAvailable',
  async ({ userType, params }: { userType: UserCourseType; params?: object }, { rejectWithValue }) => {
    try {
      const svc = getCourseService(userType);
      const data = await svc.getAvailable(params);
      const list = Array.isArray(data) ? data : (data as any)?.results ?? [];
      return list as Course[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to load courses');
    }
  }
);

export const fetchFeaturedCourses = createAsyncThunk(
  'courses/fetchFeatured',
  async (userType: UserCourseType, { rejectWithValue }) => {
    try {
      const svc = getCourseService(userType);
      const data = await svc.getFeatured();
      const list = Array.isArray(data) ? data : (data as any)?.results ?? [];
      return list as Course[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to load featured courses');
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'courses/fetchDetails',
  async ({ idOrSlug, userType }: { idOrSlug: string; userType?: UserCourseType }, { rejectWithValue }) => {
    try {
      const svc = getCourseService(userType ?? null);
      return await svc.getCourseDetails(idOrSlug) as Course;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to load course');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async (
    { courseId, courseSlug, userType }: { courseId: string; courseSlug?: string; userType?: UserCourseType },
    { rejectWithValue }
  ) => {
    try {
      const svc = getCourseService(userType ?? null);
      // Professional API requires slug; academic API requires UUID
      const identifier = (userType === 'professional' && courseSlug) ? courseSlug : courseId;
      await svc.enroll(identifier);
      return courseId; // always return the UUID for local state tracking
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to enroll');
    }
  }
);

export const completeLessonThunk = createAsyncThunk(
  'courses/completeLesson',
  async (
    { lessonId, userType, body }: { lessonId: string; userType?: UserCourseType; body?: object },
    { rejectWithValue }
  ) => {
    try {
      const svc = getCourseService(userType ?? null);
      const result = await svc.markLessonComplete(lessonId, body);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to mark lesson complete');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolled = (action.payload ?? []) as Course[];
        // Store both UUIDs and slugs so isEnrolled() works for both user types
        const ids = new Set<string>();
        state.enrolled.forEach((c: any) => {
          if (c.id) ids.add(String(c.id));
          if (c.slug) ids.add(String(c.slug));
        });
        state.enrolledCourseIds = Array.from(ids);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.available = (action.payload ?? []) as Course[];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featured = (action.payload ?? []) as Course[];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.currentCourse = action.payload as Course;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        if (action.payload && !state.enrolledCourseIds.includes(action.payload)) {
          state.enrolledCourseIds.push(action.payload);
        }
        state.isLoading = false;
      })
      .addCase(completeLessonThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        (action) => action.type.startsWith('courses/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('courses/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.payload ?? action.error.message ?? 'Something went wrong';
        }
      );
  },
});

export const { setUserType } = coursesSlice.actions;
export default coursesSlice.reducer;
