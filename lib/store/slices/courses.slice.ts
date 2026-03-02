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

export const fetchEnrolledCourses = createAsyncThunk('courses/fetchEnrolled', async () => {
  const data = await coursesService.getEnrolled();
  const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
  return list;
});

export const fetchAvailableCourses = createAsyncThunk('courses/fetchAvailable', async () => {
  const data = await coursesService.getAvailable();
  const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
  return list;
});

export const fetchFeaturedCourses = createAsyncThunk('courses/fetchFeatured', async () => {
  const data = await coursesService.getFeatured();
  const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
  return list;
});

export const fetchCourseDetails = createAsyncThunk('courses/fetchDetails', async (idOrSlug: string) => {
  return coursesService.getCourseDetails(idOrSlug) as Promise<Course>;
});

export const enrollInCourse = createAsyncThunk('courses/enroll', async (courseId: string) => {
  return courseId;
});

export const markLessonComplete = createAsyncThunk(
  'courses/markLessonComplete',
  async ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
    // TODO: Implement actual API call when backend is ready
    return { courseId, lessonId };
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
      // Mark lesson complete
      .addCase(markLessonComplete.fulfilled, (state, action) => {
        // TODO: Update course progress when backend supports it
      });
  },
});

// Selectors
export const selectCurrentCourse = (state: { courses: CoursesState }) => state.courses.currentCourse;
export const selectCurrentCourseModules = (state: { courses: CoursesState }): any[] => 
  (state.courses.currentCourse?.modules as any[]) || [];
export const selectIsEnrolled = (courseId: string) => (state: { courses: CoursesState }) => 
  state.courses.enrolledCourseIds.includes(courseId);

export default coursesSlice.reducer;
