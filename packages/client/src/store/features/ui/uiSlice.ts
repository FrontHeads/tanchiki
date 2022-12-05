import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { uiState } from './typings';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { isBurgerMenuVisible: false } as uiState,
  reducers: {
    toggleBurgerMenu(state) {
      state.isBurgerMenuVisible = !state.isBurgerMenuVisible;
    },
    closeBurgerMenu(state) {
      state.isBurgerMenuVisible = false;
    },
  },
});

export const uiSelectors = {
  all: (state: RootState) => state.ui,
  isBurgerMenuVisible: (state: RootState) => state.ui.isBurgerMenuVisible,
};

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
