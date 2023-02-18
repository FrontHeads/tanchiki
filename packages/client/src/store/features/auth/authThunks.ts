import { createAsyncThunk } from '@reduxjs/toolkit';

import { type SigninRequestData, type SignupRequestData, authAPI } from '../../../api/authAPI';

/**
 * Thunks - вызывают методы апи и полученные данные автоматически записывают в хранилище.
 */
export const signIn = createAsyncThunk('auth/signIn', async (credentials: SigninRequestData, { dispatch }) => {
  await authAPI.signin(credentials);
  await dispatch(me());
});

export const signUp = createAsyncThunk('auth/signUp', async (data: SignupRequestData, { dispatch }) => {
  await authAPI.signup(data);
  await dispatch(me());
});

export const me = createAsyncThunk('auth/me', async () => {
  const { data } = await authAPI.me();
  return data;
});

export const logout = createAsyncThunk('auth/logout', async (flushUserProfile?: boolean) => {
  await authAPI.logout();
  /**
   * Typescript не дал инициализировать значение по умолчанию в аргументах функции,
   * поэтому условие добавлено сюда
   */
  return flushUserProfile === undefined ? true : flushUserProfile;
});

export const authThunks = { me, signIn, signUp, logout };
