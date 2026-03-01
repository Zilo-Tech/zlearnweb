import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/services/api.service';

interface ProgressState {
  learningAnalytics: unknown | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = { learningAnalytics: null, isLoading: false, error: null };

export const fetchLearningAnalytics = createAsyncThunk('progress/fetchAnalytics', async () => {
  return apiService.get<unknown>('/api/progress/learning-analytics/');
});

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearningAnalytics.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLearningAnalytics.fulfilled, (state, action) => {
        state.learningAnalytics = action.payload ?? null;
        state.isLoading = false;
      })
      .addCase(fetchLearningAnalytics.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed';
        state.isLoading = false;
      });
  },
});

export default progressSlice.reducer;
