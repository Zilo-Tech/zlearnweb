import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OnboardingData } from '@/lib/types';

const initialState: OnboardingData = {};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      return { ...state, ...action.payload };
    },
    clearOnboarding: () => initialState,
  },
});

export const { updateOnboardingData, clearOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
