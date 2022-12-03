import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { uiState } from './typings';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { isBurgerVisible: false } as uiState,
  reducers: {
    toggleBurger(state) {
      state.isBurgerVisible = !state.isBurgerVisible;
    },
    closeBurger(state) {
      state.isBurgerVisible = false;
    },
  },
});

export const uiSelectors = {
  all: (state: RootState) => state.ui,
  isBurgerVisible: (state: RootState) => state.ui.isBurgerVisible,
};

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
