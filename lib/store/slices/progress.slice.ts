import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '@/lib/services';
import { ProgressState } from '@/lib/types';

const initialState: ProgressState = {
    userProgress: null,
    learningAnalytics: null,
    isLoading: false,
    error: null,
};

export const fetchUserProgress = createAsyncThunk(
    'progress/fetchUserProgress',
    async (_, { rejectWithValue }) => {
        try {
            return await progressService.getUserProgress();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLearningAnalytics = createAsyncThunk(
    'progress/fetchLearningAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            return await progressService.getLearningAnalytics();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        clearProgressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProgress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userProgress = action.payload;
            })
            .addCase(fetchUserProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLearningAnalytics.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLearningAnalytics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.learningAnalytics = action.payload;
            })
            .addCase(fetchLearningAnalytics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProgressError } = progressSlice.actions;
export default progressSlice.reducer;
