import { createSlice } from '@reduxjs/toolkit';

import { type RootState } from '../..';

const initialState = {};

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {},
});

export const forumSelectors = {
  all: (state: RootState) => state.forum,
};

export const forumActions = forumSlice.actions;
export const forumReducer = forumSlice.reducer;
