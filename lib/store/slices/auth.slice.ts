import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  onboardingComplete: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    return authService.login(credentials);
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const refreshUserProfile = createAsyncThunk('auth/refreshProfile', async () => {
  return authService.getProfile();
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name?: string }) => {
    return authService.register(data);
  }
);

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token: string) => {
  return authService.verifyEmail(token);
});

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (payload: Record<string, unknown>) => {
    return authService.completeOnboarding(payload);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    switchUserType: (state, action: PayloadAction<'academic' | 'professional' | 'exams'>) => {
      if (state.user) state.user.user_type = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? state.user;
        state.token = action.payload?.token ?? state.token;
        state.isAuthenticated = !!state.token;
        state.onboardingComplete = action.payload?.user?.onboarding_complete ?? state.onboardingComplete;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        if (action.payload) state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? state.user;
        state.token = action.payload?.token ?? state.token;
        state.isAuthenticated = !!state.token;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.onboardingComplete = true;
      });
  },
});

export const { setUser, switchUserType } = authSlice.actions;
export default authSlice.reducer;
