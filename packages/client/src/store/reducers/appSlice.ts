import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '../../app.typings';
import { RootState } from '../store';

export interface AppState {
  isLoading: boolean;
  userIsAuthenticated: boolean;
  userProfile: UserProfile | null;
}

const initialState: AppState = {
  isLoading: false,
  userIsAuthenticated: false,
  userProfile: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserIsAuthenticated: (state, { payload }: PayloadAction<boolean>) => {
      state.userIsAuthenticated = payload;
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setUserProfile: (state, { payload }: PayloadAction<UserProfile>) => {
      state.userProfile = payload;
    },
  },
});

const app = (state: RootState) => state.app;
const isLoading = (state: RootState) => state.app.isLoading;
const userIsAuthenticated = (state: RootState) => state.app.userIsAuthenticated;
const userProfile = (state: RootState) => state.app.userProfile;

export const appSelectors = { app, isLoading, userIsAuthenticated, userProfile };
export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
