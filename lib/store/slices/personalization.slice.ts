import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { personalizationService, PersonalizedDashboard, RecommendationsResponse, EntranceExamResponse, StudyPlanResponse } from '@/lib/services/personalization.service';

interface PersonalizationState {
    dashboard: PersonalizedDashboard | null;
    recommendations: RecommendationsResponse | null;
    entranceExam: EntranceExamResponse | null;
    studyPlan: StudyPlanResponse | null;
    isLoading: boolean;
    error: null | string;
}

const initialState: PersonalizationState = {
    dashboard: null,
    recommendations: null,
    entranceExam: null,
    studyPlan: null,
    isLoading: false,
    error: null,
};

export const fetchPersonalizedDashboard = createAsyncThunk(
    'personalization/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            return await personalizationService.getDashboard();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRecommendations = createAsyncThunk(
    'personalization/fetchRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            return await personalizationService.getRecommendations();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEntranceExam = createAsyncThunk(
    'personalization/fetchEntranceExam',
    async (_, { rejectWithValue }) => {
        try {
            return await personalizationService.getEntranceExam();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStudyPlan = createAsyncThunk(
    'personalization/fetchStudyPlan',
    async (_, { rejectWithValue }) => {
        try {
            return await personalizationService.getStudyPlan();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const personalizationSlice = createSlice({
    name: 'personalization',
    initialState,
    reducers: {
        clearPersonalizationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalizedDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPersonalizedDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchPersonalizedDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
            })
            .addCase(fetchEntranceExam.fulfilled, (state, action) => {
                state.entranceExam = action.payload;
            })
            .addCase(fetchStudyPlan.fulfilled, (state, action) => {
                state.studyPlan = action.payload;
            });
    },
});

export const { clearPersonalizationError } = personalizationSlice.actions;
export default personalizationSlice.reducer;
export type { PersonalizationState };
