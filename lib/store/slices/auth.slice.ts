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
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : err?.message ?? 'Login failed. Please check your credentials.';
      return rejectWithValue(msg);
    }
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
  async (data: { email: string; password: string; name?: string; [key: string]: unknown }, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : err?.message ?? 'Registration failed. Please try again.';
      return rejectWithValue(msg);
    }
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
    // ── loginUser ──────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user ?? state.user;
        state.token = action.payload?.token ?? state.token;
        state.isAuthenticated = !!state.token;
        state.onboardingComplete = action.payload?.user?.onboarding_complete ?? state.onboardingComplete;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Login failed';
      })
    // ── registerUser ───────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user ?? state.user;
        state.token = action.payload?.token ?? state.token;
        state.isAuthenticated = !!state.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Registration failed';
      })
    // ── logoutUser ─────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, () => initialState)
    // ── refreshUserProfile ─────────────────────────────────────────────────
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        if (action.payload) state.user = action.payload;
      })
    // ── verifyEmail ────────────────────────────────────────────────────────
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
    // ── completeOnboarding ─────────────────────────────────────────────────
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.onboardingComplete = true;
      });
  },
});

export const { setUser, switchUserType } = authSlice.actions;
export default authSlice.reducer;
