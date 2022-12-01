import { createAsyncThunk } from '@reduxjs/toolkit';

import { authAPI, SigninRequestData, SignupRequestData } from '../../../api/authAPI';
import { appActions } from '../app/appSlice';

export const signIn = createAsyncThunk('auth/signin', async (credentials: SigninRequestData, { dispatch }) => {
  await authAPI.signin(credentials);
  await dispatch(me());
});

export const signUp = createAsyncThunk('auth/signup', async (data: SignupRequestData, { dispatch }) => {
  await authAPI.signup(data);
  await dispatch(me());
});

export const me = createAsyncThunk('auth/me', async (_, { dispatch }) => {
  const { data } = await authAPI.me();
  dispatch(appActions.setUserProfile(data));
  return data;
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await authAPI.logout();
  dispatch(appActions.setUserProfile(null));
});

export const authThunks = { me, signIn, signUp, logout };
