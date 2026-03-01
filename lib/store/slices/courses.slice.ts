import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { coursesService } from '@/lib/services';
import { Course, CourseFilters, CoursesState, CourseProgress } from '@/lib/types';

// Initial state
const initialState: CoursesState = {
    enrolled: [],
    available: [],
    featured: [],
    currentCourse: null,
    currentCourseModules: [],
    progress: {},
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchEnrolledCourses = createAsyncThunk(
    'courses/fetchEnrolled',
    async (_, { rejectWithValue }) => {
        try {
            return await coursesService.getEnrolledCourses();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAvailableCourses = createAsyncThunk(
    'courses/fetchAvailable',
    async (filters: CourseFilters | undefined, { rejectWithValue }) => {
        try {
            const response: any = await coursesService.getAvailableCourses(filters);
            // Handle both paginated (response.results) and non-paginated (response array) formats
            if (Array.isArray(response)) {
                return response;
            }
            return response.results || [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFeaturedCourses = createAsyncThunk(
    'courses/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            return await coursesService.getFeaturedCourses();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseDetails = createAsyncThunk(
    'courses/fetchDetails',
    async (courseId: string, { rejectWithValue, dispatch }) => {
        try {
            const course = await coursesService.getCourseDetails(courseId);
            // Also fetch modules when details are fetched
            dispatch(fetchCourseModules(courseId));
            return course;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseModules = createAsyncThunk(
    'courses/fetchModules',
    async (courseId: string, { rejectWithValue }) => {
        try {
            return await coursesService.getCourseModules(courseId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const enrollInCourse = createAsyncThunk(
    'courses/enroll',
    async (courseId: string, { rejectWithValue, dispatch }) => {
        try {
            const result = await coursesService.enrollInCourse(courseId);
            // Refresh enrolled courses after enrollment
            dispatch(fetchEnrolledCourses());
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseProgress = createAsyncThunk(
    'courses/fetchProgress',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const progress = await coursesService.getCourseProgress(courseId);
            return { courseId, progress };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markLessonComplete = createAsyncThunk(
    'courses/markLessonComplete',
    async (
        { lessonId, courseId, data }: { lessonId: string; courseId: string; data?: any },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const result = await coursesService.markLessonComplete(lessonId, data);
            // Refresh course progress
            dispatch(fetchCourseProgress(courseId));
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
            state.currentCourse = action.payload;
        },
        clearCoursesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch enrolled courses
        builder
            .addCase(fetchEnrolledCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.enrolled = action.payload;
            })
            .addCase(fetchEnrolledCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch available courses
        builder
            .addCase(fetchAvailableCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.available = action.payload;
            })
            .addCase(fetchAvailableCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch featured courses
        builder
            .addCase(fetchFeaturedCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featured = action.payload;
            })
            .addCase(fetchFeaturedCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch course details
        builder
            .addCase(fetchCourseDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch course modules
        builder
            .addCase(fetchCourseModules.fulfilled, (state, action) => {
                state.currentCourseModules = action.payload;
            });

        // Enroll in course
        builder
            .addCase(enrollInCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(enrollInCourse.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch course progress
        builder
            .addCase(fetchCourseProgress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourseProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.progress[action.payload.courseId] = action.payload.progress;
            })
            .addCase(fetchCourseProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Mark lesson complete
        builder
            .addCase(markLessonComplete.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markLessonComplete.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(markLessonComplete.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCurrentCourse, clearCoursesError } = coursesSlice.actions;

// Selectors
export const selectEnrolledCourses = (state: { courses: CoursesState }) => state.courses.enrolled;
export const selectCurrentCourse = (state: { courses: CoursesState }) => state.courses.currentCourse;
export const selectCurrentCourseModules = (state: { courses: CoursesState }) => state.courses.currentCourseModules;
export const selectIsEnrolled = (courseId: string | undefined) => (state: { courses: CoursesState }) =>
    courseId ? state.courses.enrolled.some(c => c.id === courseId) : false;
export const selectCourseProgressData = (courseId: string | undefined) => (state: { courses: CoursesState }) =>
    courseId ? state.courses.progress[courseId] : null;

export default coursesSlice.reducer;
