import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gamificationService } from '@/lib/services';
import { GamificationState } from '@/lib/types';

const initialState: GamificationState & { leaderboard: any[] } = {
    xpData: null,
    levelData: null,
    streakData: null,
    achievements: [],
    leaderboard: [],
    isLoading: false,
    error: null,
};

export const fetchXP = createAsyncThunk(
    'gamification/fetchXP',
    async (_, { rejectWithValue }) => {
        try {
            return await gamificationService.getXP();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLevel = createAsyncThunk(
    'gamification/fetchLevel',
    async (_, { rejectWithValue }) => {
        try {
            return await gamificationService.getLevel();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStreakData = createAsyncThunk(
    'gamification/fetchStreak',
    async (_, { rejectWithValue }) => {
        try {
            return await gamificationService.getStreakData();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAchievements = createAsyncThunk(
    'gamification/fetchAchievements',
    async (_, { rejectWithValue }) => {
        try {
            return await gamificationService.getAchievements();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLeaderboard = createAsyncThunk(
    'gamification/fetchLeaderboard',
    async (params: { period?: 'daily' | 'weekly' | 'monthly' | 'all-time'; limit?: number } | undefined, { rejectWithValue }) => {
        try {
            return await gamificationService.getLeaderboard(params);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const gamificationSlice = createSlice({
    name: 'gamification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchXP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchXP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.xpData = action.payload;
            })
            .addCase(fetchXP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLevel.fulfilled, (state, action) => {
                state.levelData = action.payload;
            })
            .addCase(fetchStreakData.fulfilled, (state, action) => {
                state.streakData = action.payload;
            })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.achievements = action.payload;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload;
            });
    },
});

export default gamificationSlice.reducer;
