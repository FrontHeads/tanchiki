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

export const me = createAsyncThunk('auth/me', async (throwError?: boolean) => {
  throwError = throwError === undefined ? true : throwError;
  let response = null;
  try {
    response = await authAPI.me();
  } catch (error) {
    if (throwError) {
      throw error;
    }
  }
  return response?.data || null;
});

export const logout = createAsyncThunk('auth/logout', async (flushUserProfile?: boolean) => {
  /**
   * Typescript не дал инициализировать значение по умолчанию в аргументах функции,
   * поэтому условие добавлено сюда
   */
  flushUserProfile = flushUserProfile === undefined ? true : flushUserProfile;
  await authAPI.logout();
  return flushUserProfile;
});

export const authThunks = { me, signIn, signUp, logout };
