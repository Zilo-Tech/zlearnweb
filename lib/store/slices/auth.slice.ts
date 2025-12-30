import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, storageService } from '@/lib/services';
import { User, LoginCredentials, RegisterData, AuthState } from '@/lib/types';

// Initial state
const initialState: AuthState = {
    user: storageService.getUser<User>(),
    token: storageService.getAuthToken(),
    isAuthenticated: storageService.isAuthenticated(),
    onboardingComplete: storageService.getOnboardingComplete(),
    isLoading: false,
    error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);

            // Store tokens and user
            storageService.setAuthToken(response.data.token);
            storageService.setRefreshToken(response.data.refresh_token);
            storageService.setUser(response.data.user);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);

            // Store tokens and user
            storageService.setAuthToken(response.data.token);
            storageService.setRefreshToken(response.data.refresh_token);
            storageService.setUser(response.data.user);
            storageService.setOnboardingComplete(response.data.user.onboarding_complete);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();

            // Clear storage
            storageService.clearAuthData();
            storageService.setOnboardingComplete(false);

            return null;
        } catch (error: any) {
            // Clear storage even if API call fails
            storageService.clearAuthData();
            storageService.setOnboardingComplete(false);
            return null;
        }
    }
);

export const refreshUserProfile = createAsyncThunk(
    'auth/refreshProfile',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.getProfile();
            storageService.setUser(user);
            storageService.setOnboardingComplete(user.onboarding_complete);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: Partial<User>, { rejectWithValue }) => {
        try {
            const user = await authService.updateProfile(data);
            storageService.setUser(user);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const switchUserType = createAsyncThunk(
    'auth/switchUserType',
    async (userType: 'academic' | 'professional', { rejectWithValue }) => {
        try {
            const response = await authService.switchAccountType(userType);
            const user = response.user;
            storageService.setUser(user);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token: string, { rejectWithValue }) => {
        try {
            await authService.verifyEmail(token);
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const completeOnboarding = createAsyncThunk(
    'auth/completeOnboarding',
    async (data: any, { rejectWithValue }) => {
        try {
            const user = await authService.completeOnboarding(data);
            storageService.setUser(user);
            storageService.setOnboardingComplete(true);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            storageService.setUser(action.payload);
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            storageService.setAuthToken(action.payload);
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.onboardingComplete = false;
            storageService.clearAuthData();
            storageService.setOnboardingComplete(false);
        },
        setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
            state.onboardingComplete = action.payload;
            storageService.setOnboardingComplete(action.payload);
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.onboardingComplete = action.payload.user.onboarding_complete;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.onboardingComplete = action.payload.user.onboarding_complete;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.onboardingComplete = false;
                state.error = null;
            });

        // Refresh profile
        builder
            .addCase(refreshUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.onboardingComplete = action.payload.onboarding_complete;
            })
            .addCase(refreshUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Switch user type
        builder
            .addCase(switchUserType.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(switchUserType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(switchUserType.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Verify email
        builder
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.isLoading = false;
                if (state.user) {
                    state.user.is_email_verified = true;
                }
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Complete onboarding
        builder
            .addCase(completeOnboarding.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(completeOnboarding.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.onboardingComplete = true;
            })
            .addCase(completeOnboarding.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, setToken, clearAuth, setOnboardingComplete } = authSlice.actions;
export default authSlice.reducer;
