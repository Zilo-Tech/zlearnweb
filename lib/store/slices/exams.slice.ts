import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/services/api.service';

interface ExamsState {
  results: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamsState = { results: [], isLoading: false, error: null };

export const fetchExamResults = createAsyncThunk('exams/fetchResults', async () => {
  const data = await apiService.get<unknown>('/api/exams/results/');
  return Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
});

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamResults.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchExamResults.fulfilled, (state, action) => {
        state.results = action.payload ?? [];
        state.isLoading = false;
      })
      .addCase(fetchExamResults.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed';
        state.isLoading = false;
      });
  },
});

export default examsSlice.reducer;
