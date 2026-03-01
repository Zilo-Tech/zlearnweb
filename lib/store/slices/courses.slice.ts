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
  const data = await coursesService.getEnrolled();
  const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
  return list;
});

export const fetchFeaturedCourses = createAsyncThunk('courses/fetchFeatured', async () => {
  const data = await coursesService.getEnrolled();
  const list = Array.isArray(data) ? data : (data as { results?: Course[] })?.results ?? [];
  return list;
});

export const fetchCourseDetails = createAsyncThunk('courses/fetchDetails', async (idOrSlug: string) => {
  return coursesService.getCourseDetails(idOrSlug) as Promise<Course>;
});

export const enrollInCourse = createAsyncThunk('courses/enroll', async (courseId: string) => {
  return courseId;
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolled = (action.payload ?? []) as Course[];
        state.enrolledCourseIds = state.enrolled.map((c) => c.id);
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.available = (action.payload ?? []) as Course[];
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featured = (action.payload ?? []) as Course[];
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.currentCourse = action.payload as Course;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        if (action.payload && !state.enrolledCourseIds.includes(action.payload)) {
          state.enrolledCourseIds.push(action.payload);
        }
      });
  },
});

export default coursesSlice.reducer;
