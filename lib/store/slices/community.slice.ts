import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityService } from '@/lib/services';
import { CommunityState } from '@/lib/types';

const initialState: CommunityState = {
    forums: [],
    discussions: [],
    studyGroups: [],
    notifications: [],
    isLoading: false,
    error: null,
};

export const fetchForums = createAsyncThunk(
    'community/fetchForums',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await communityService.getForums(params);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchDiscussions = createAsyncThunk(
    'community/fetchDiscussions',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await communityService.getDiscussions(params);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDiscussion = createAsyncThunk(
    'community/createDiscussion',
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const result = await communityService.createDiscussion(data);
            dispatch(fetchDiscussions({}));
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStudyGroups = createAsyncThunk(
    'community/fetchStudyGroups',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await communityService.getStudyGroups(params);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const joinStudyGroup = createAsyncThunk(
    'community/joinStudyGroup',
    async (groupId: string, { rejectWithValue }) => {
        try {
            return await communityService.joinStudyGroup(groupId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    'community/fetchNotifications',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await communityService.getNotifications(params);
            return response.results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const communitySlice = createSlice({
    name: 'community',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchForums.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchForums.fulfilled, (state, action) => {
                state.isLoading = false;
                state.forums = action.payload;
            })
            .addCase(fetchForums.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDiscussions.fulfilled, (state, action) => {
                state.discussions = action.payload;
            })
            .addCase(fetchStudyGroups.fulfilled, (state, action) => {
                state.studyGroups = action.payload;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
            });
    },
});

export default communitySlice.reducer;
