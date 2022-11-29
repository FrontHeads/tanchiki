import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '../../../app.typings';
import { RootState } from '../../store';

export interface AppState {
  isLoading: boolean;
  userProfile: UserProfile | null;
}

const initialState: AppState = {
  isLoading: false,
  userProfile: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setUserProfile: (state, { payload }: PayloadAction<Nullable<UserProfile>>) => {
      state.userProfile = payload;
    },
  },
});

export const appSelectors = {
  all: (state: RootState) => state.app,
  isLoading: (state: RootState) => state.app.isLoading,
  userProfile: (state: RootState) => state.app.userProfile,
};

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
