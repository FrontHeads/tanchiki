import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from './features/app/appSlice';
import { authReducer } from './features/auth/authSlice';
import { leaderboardReducer } from './features/leaderboard/leaderboardSlice';
import { profileReducer } from './features/profile/profileSlice';
import { uiReducer } from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
