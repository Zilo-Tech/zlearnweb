import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './slices/auth.slice';
import coursesReducer from './slices/courses.slice';
import professionalCoursesReducer from './slices/professional-courses.slice';
import examsReducer from './slices/exams.slice';
import communityReducer from './slices/community.slice';
import gamificationReducer from './slices/gamification.slice';
import onboardingReducer from './slices/onboarding.slice';
import progressReducer from './slices/progress.slice';
import toastReducer from './slices/toast.slice';
import personalizationReducer from './slices/personalization.slice';

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    professionalCourses: professionalCoursesReducer,
    exams: examsReducer,
    community: communityReducer,
    gamification: gamificationReducer,
    onboarding: onboardingReducer,
    progress: progressReducer,
    toast: toastReducer,
    personalization: personalizationReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'onboarding'], // Only persist auth and onboarding
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
