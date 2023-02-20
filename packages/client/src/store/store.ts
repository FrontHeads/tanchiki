import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { appReducer, authReducer, leaderboardReducer, profileReducer, uiReducer } from '.';

const rootReducer = combineReducers({
  app: appReducer,
  profile: profileReducer,
  auth: authReducer,
  ui: uiReducer,
  leaderboard: leaderboardReducer,
});

export const setupStore = () => {
  const preloadedState = typeof window !== 'undefined' ? window.__PRELOADED_STATE__ : undefined;

  if (typeof window !== 'undefined') {
    delete window?.__PRELOADED_STATE__;
  }

  return configureStore({
    reducer: rootReducer,
    /** Загружаем начальное состояние, которое было передано из SSR сборки с сервера */
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof setupStore>['dispatch'];
