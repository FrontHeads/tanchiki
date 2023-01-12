import { createSlice } from '@reduxjs/toolkit';

import { type RootState } from '../../store';
import { type UIState } from './typings';

export const UISlice = createSlice({
  name: 'UI',
  initialState: { isBurgerMenuVisible: false } as UIState,
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

export const uiActions = UISlice.actions;
export const uiReducer = UISlice.reducer;
