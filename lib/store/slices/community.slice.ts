import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/services/api.service';

interface CommunityState {
  forums: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommunityState = { forums: [], isLoading: false, error: null };

export const fetchForums = createAsyncThunk(
  'community/fetchForums',
  async (_: Record<string, unknown>) => {
    const data = await apiService.get<{ results?: unknown[] }>('/api/community/forums/');
    return Array.isArray(data) ? data : (data as { results?: unknown[] }).results ?? [];
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForums.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchForums.fulfilled, (state, action) => {
        state.forums = action.payload ?? [];
        state.isLoading = false;
      })
      .addCase(fetchForums.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to fetch';
        state.isLoading = false;
      });
  },
});

export default communitySlice.reducer;
