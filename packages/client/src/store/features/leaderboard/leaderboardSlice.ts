import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './../../store';
import { leaderboardThunks } from './leaderboardThunks';
import { LeaderboardState } from './typings';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    isLoading: false,
    leaderboard: [],
  } as LeaderboardState,

  reducers: {},
  extraReducers: builder => {
    builder

      //** get leaderboard */
      .addCase(leaderboardThunks.getLeaderboard.pending, state => {
        state.isLoading = true;
      })
      .addCase(leaderboardThunks.getLeaderboard.fulfilled, (state, action: any) => {
        state.leaderboard = action.payload;
        state.isLoading = false;
      })
      .addCase(leaderboardThunks.getLeaderboard.rejected, state => {
        state.isLoading = false;
      })

      //** add score */
      .addCase(leaderboardThunks.addScore.pending, state => {
        state.isLoading = true;
      })
      .addCase(leaderboardThunks.addScore.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(leaderboardThunks.addScore.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const leaderboardSelectors = {
  all: (state: RootState) => state.leaderboard,
};

export const leaderboardActions = leaderboardSlice.actions;
export const leaderboardReducer = leaderboardSlice.reducer;
