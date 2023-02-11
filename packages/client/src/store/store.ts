import { configureStore } from '@reduxjs/toolkit';

import { appReducer, authReducer, leaderboardReducer, profileReducer } from '.';
import { uiReducer } from './features/ui/uiSlice';

const preloadedState = typeof window !== 'undefined' ? window.__PRELOADED_STATE__ : undefined;

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
    leaderboard: leaderboardReducer,
  },
  /** Загружаем начальное состояние, которое было передано из SSR сборки с сервера */
  preloadedState,
});

if (typeof window !== 'undefined') {
  delete window?.__PRELOADED_STATE__;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
