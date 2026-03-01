import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth.slice';
import onboardingReducer from './slices/onboarding.slice';
import communityReducer from './slices/community.slice';
import examsReducer from './slices/exams.slice';
import progressReducer from './slices/progress.slice';
import toastReducer from './slices/toast.slice';
import coursesReducer from './slices/courses.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  community: communityReducer,
  exams: examsReducer,
  progress: progressReducer,
  toast: toastReducer,
  courses: coursesReducer,
});

const persistConfig = { key: 'root', storage, whitelist: ['auth', 'onboarding'] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
