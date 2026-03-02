import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper to get initial state from localStorage
const getInitialAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      onboardingComplete: false,
      isLoading: false,
      error: null,
    };
  }
  
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const userStr = localStorage.getItem(STORAGE_KEYS.user);
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!token,
    onboardingComplete: user?.onboarding_complete ?? false,
    isLoading: false,
    error: null,
  };
};

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
    hydrateAuth: (state) => {
      const hydrated = getInitialAuthState();
      state.user = hydrated.user;
      state.token = hydrated.token;
      state.isAuthenticated = hydrated.isAuthenticated;
      state.onboardingComplete = hydrated.onboardingComplete;
      if (state.token) {
        console.log('🔄 Auth state hydrated from localStorage');
      }
    },
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.isAuthenticated = !!action.payload?.token;
        state.onboardingComplete = action.payload?.user?.onboarding_complete ?? false;
        state.isLoading = false;
        state.error = null;
        console.log('✅ Login successful, token set in Redux:', !!state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, () => {
        console.log('✅ Auth state reset to initial state');
        return initialState;
      })
      .addCase(logoutUser.rejected, () => {
        console.log('⚠️ Logout rejected, but resetting auth state anyway');
        return initialState;
      })
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        if (action.payload) state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.isAuthenticated = !!action.payload?.token;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.onboardingComplete = true;
      });
  },
});

export const { hydrateAuth, setUser, switchUserType } = authSlice.actions;
export default authSlice.reducer;
