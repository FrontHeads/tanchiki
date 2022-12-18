import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from './features/app/appSlice';
import { authReducer } from './features/auth/authSlice';
import { profileReducer } from './features/profile/profileSlice';
import { uiReducer } from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
