import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserProfile } from '../../../app.typings';
import { RootState } from '../../store';
import { authThunks } from './authThunks';
import { AuthState } from './typings';

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    error: '',
    userProfile: null,
  } as AuthState,
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
      .addCase(authThunks.logout.fulfilled, state => {
        state.isLoading = false;
        state.userProfile = null;
      })
      .addCase(authThunks.logout.rejected, state => {
        state.isLoading = false;
      });
  },
});

// Selectors
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
