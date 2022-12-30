import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from './features/app/appSlice';
import { authReducer } from './features/auth/authSlice';
import { profileReducer } from './features/profile/profileSlice';
import { uiReducer } from './features/ui/uiSlice';

const preloadedState = typeof window !== 'undefined' ? window?.__PRELOADED_STATE__ : undefined;

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  /** Загружаем initialState, который был передан из SSR сборки */
  preloadedState,
});

if (typeof window !== 'undefined') {
  delete window?.__PRELOADED_STATE__;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
