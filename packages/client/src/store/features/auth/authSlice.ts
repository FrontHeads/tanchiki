import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { authThunks } from './authThunks';
import { AuthState } from './typings';

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    isAuthenticated: false,
    error: '',
  } as AuthState,
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
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
      .addCase(authThunks.me.fulfilled, state => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(authThunks.me.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })

      // Logout
      .addCase(authThunks.logout.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(authThunks.logout.fulfilled, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
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
  error: (state: RootState) => state.auth.error,
};

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
