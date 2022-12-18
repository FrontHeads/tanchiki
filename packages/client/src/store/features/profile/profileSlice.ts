import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { profileThunks } from './profileThunks';
import { ProfileState, UpdateResult } from './typings';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isProfileLoading: false,
    updateResult: [] as UpdateResult,
  } as ProfileState,
  reducers: {
    setUpdateResult: (state, { payload }: PayloadAction<UpdateResult>) => {
      state.updateResult.length = 0;
      state.updateResult = payload;
    },
    setIsProfileLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isProfileLoading = payload;
    },
  },
  extraReducers: builder => {
    builder
      // Update Profile
      .addCase(profileThunks.updateProfile.pending, state => {
        state.isProfileLoading = true;
        state.updateResult.length = 0;
      })
      .addCase(profileThunks.updateProfile.fulfilled, (state, { payload }) => {
        state.isProfileLoading = false;
        state.updateResult = state.updateResult.concat(payload);
      });
  },
});

export const profileSelectors = {
  all: (state: RootState) => state.profile,
};

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
