import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { AppState } from './typings';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    isAppLoading: true,
  } as AppState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isAppLoading = payload;
    },
  },
});

export const appSelectors = {
  all: (state: RootState) => state.app,
  isAppLoading: (state: RootState) => state.app.isAppLoading,
};

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
