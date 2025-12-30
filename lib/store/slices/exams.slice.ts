import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examsService } from '@/lib/services';
import { ExamsState } from '@/lib/types';

const initialState: ExamsState = {
    exams: [],
    practiceTests: [],
    currentExam: null,
    results: [],
    isLoading: false,
    error: null,
};

export const fetchExams = createAsyncThunk(
    'exams/fetchExams',
    async (filters: any, { rejectWithValue }) => {
        try {
            const response = await examsService.getExams(filters);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPracticeTests = createAsyncThunk(
    'exams/fetchPracticeTests',
    async (_, { rejectWithValue }) => {
        try {
            return await examsService.getPracticeTests();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchExamDetails = createAsyncThunk(
    'exams/fetchDetails',
    async (examId: string, { rejectWithValue }) => {
        try {
            return await examsService.getExamDetails(examId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const startExam = createAsyncThunk(
    'exams/start',
    async (examId: string, { rejectWithValue }) => {
        try {
            return await examsService.startExam(examId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitExam = createAsyncThunk(
    'exams/submit',
    async ({ examId, answers }: { examId: string; answers: any[] }, { rejectWithValue }) => {
        try {
            return await examsService.submitExam(examId, answers);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchExamResults = createAsyncThunk(
    'exams/fetchResults',
    async (_, { rejectWithValue }) => {
        try {
            return await examsService.getExamResults();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const examsSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: {
        setCurrentExam: (state, action) => {
            state.currentExam = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exams = action.payload;
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPracticeTests.fulfilled, (state, action) => {
                state.practiceTests = action.payload;
            })
            .addCase(fetchExamDetails.fulfilled, (state, action) => {
                state.currentExam = action.payload;
            })
            .addCase(fetchExamResults.fulfilled, (state, action) => {
                state.results = action.payload;
            });
    },
});

export const { setCurrentExam } = examsSlice.actions;
export default examsSlice.reducer;
