import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type UserProfile } from '../../../app.typings';
import { type RootState } from '../../store';
import { authThunks } from './authThunks';
import { type AuthState } from './typings';

/**
 * Slice - это часть общего хранилища, выделенная по логическому принципу.
 * В разных slice могут быть одинаковые поля, но значения в них разные.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    error: '',
    userProfile: null,
  } as AuthState,
  /**
   * Reducers - сеттеры хранилища, т.е. добавляют новые значения в хранилище.
   * Внутри Reducers - actions. Actions - это правила какие данные и куда вставлять.
   */
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
    setUserProfile: (state, { payload }: PayloadAction<Nullable<UserProfile>>) => {
      state.userProfile = payload;
    },
  },
  extraReducers: builder => {
    builder
      // SignIn
      .addCase(authThunks.signIn.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(authThunks.signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })

      // SignUp
      .addCase(authThunks.signUp.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      // Здесь нет fulfilled т.к. вызывается thunk Me и уже там отрабатывает fulfilled,
      // который ставит isLoading=false
      .addCase(authThunks.signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })

      // Me
      .addCase(authThunks.me.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(authThunks.me.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userProfile = payload;
      })
      .addCase(authThunks.me.rejected, (state, action) => {
        state.isLoading = false;
        state.userProfile = null;
        state.error = action.error.message as string;
      })

      // Logout
      .addCase(authThunks.logout.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(authThunks.logout.fulfilled, (state, { payload: flushUserProfile }) => {
        state.isLoading = false;
        if (flushUserProfile) {
          state.userProfile = null;
        }
      })
      .addCase(authThunks.logout.rejected, state => {
        state.isLoading = false;
      });
  },
});

/**
 * Selectors - геттеры хранилища, т.е. забирают нужные данные из хранилища.
 * authSelectors - это набор селекторов, т.е. правил какие данные и откуда забирать.
 */
export const authSelectors = {
  all: (state: RootState) => state.auth,
  isLoading: (state: RootState) => state.auth.isLoading,
  isAuthenticated: (state: RootState) => state.auth.userProfile !== null,
  userProfile: (state: RootState) => state.auth.userProfile,
  error: (state: RootState) => state.auth.error,
  authState: (state: RootState) => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    isAuthenticated: state.auth.userProfile !== null,
  }),
};

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
