import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingData } from '@/lib/types';

interface OnboardingState {
    data: OnboardingData;
    isSubmitting: boolean;
    isComplete: boolean;
    error: string | null;
}

const initialState: OnboardingState = {
    data: {},
    isSubmitting: false,
    isComplete: false,
    error: null,
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
            state.data = { ...state.data, ...action.payload };
        },
        setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
            state.isComplete = action.payload;
        },
        resetOnboarding: (state) => {
            state.data = {};
            state.isSubmitting = false;
            state.isComplete = false;
            state.error = null;
        },
    },
});

export const { updateOnboardingData, setOnboardingComplete, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
