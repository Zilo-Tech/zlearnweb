import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { professionalCoursesService } from '@/lib/services';
import { ProfessionalCourse } from '@/lib/types';

interface ProfessionalCoursesState {
    courses: ProfessionalCourse[];
    categories: any[];
    enrolled: ProfessionalCourse[];
    featured: ProfessionalCourse[];
    currentCourse: ProfessionalCourse | null;
    wishlist: any[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProfessionalCoursesState = {
    courses: [],
    categories: [],
    enrolled: [],
    featured: [],
    currentCourse: null,
    wishlist: [],
    isLoading: false,
    error: null,
};

export const fetchProfessionalCourses = createAsyncThunk(
    'professionalCourses/fetchCourses',
    async (filters: any, { rejectWithValue }) => {
        try {
            const response = await professionalCoursesService.getCourses(filters);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFeaturedProfessionalCourses = createAsyncThunk(
    'professionalCourses/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            return await professionalCoursesService.getFeaturedCourses();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseBySlug = createAsyncThunk(
    'professionalCourses/fetchBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            return await professionalCoursesService.getCourseBySlug(slug);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const enrollInProfessionalCourse = createAsyncThunk(
    'professionalCourses/enroll',
    async (data: any, { rejectWithValue }) => {
        try {
            return await professionalCoursesService.enrollInCourse(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleWishlist = createAsyncThunk(
    'professionalCourses/toggleWishlist',
    async (courseId: string, { rejectWithValue }) => {
        try {
            return await professionalCoursesService.toggleWishlist(courseId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const professionalCoursesSlice = createSlice({
    name: 'professionalCourses',
    initialState,
    reducers: {
        setCurrentProfessionalCourse: (state, action) => {
            state.currentCourse = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfessionalCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfessionalCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(fetchProfessionalCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchFeaturedProfessionalCourses.fulfilled, (state, action) => {
                state.featured = action.payload;
            })
            .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
            });
    },
});

export const { setCurrentProfessionalCourse } = professionalCoursesSlice.actions;
export default professionalCoursesSlice.reducer;
