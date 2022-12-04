import { createAsyncThunk } from '@reduxjs/toolkit';

import { UpdatePasswordRequestData, UpdateProfileRequestData, userAPI } from '../../../api/userAPI';
import { me } from '../auth/authThunks';
import { appActions } from './appSlice';

export const updatePassword = createAsyncThunk(
  'app/updatePassword',
  async (data: UpdatePasswordRequestData, { dispatch }) => {
    await userAPI.updatePassword(data);
  }
);

export const updateProfile = createAsyncThunk(
  'app/updateProfile',
  async (data: UpdateProfileRequestData, { dispatch }) => {
    await userAPI.updateProfile(data);
  }
);

export const updateProfileAvatar = createAsyncThunk('app/updateProfileAvatar', async (file: File, { dispatch }) => {
  const formData = new FormData();
  formData.append('avatar', file);
  await userAPI.updateProfileAvatar(formData);
  await dispatch(me());
});

export const appThunks = { updatePassword, updateProfile, updateProfileAvatar };
