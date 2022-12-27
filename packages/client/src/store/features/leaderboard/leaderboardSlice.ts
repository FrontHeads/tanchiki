import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './../../store';
import { addScore, leaderboardThunks } from './leaderboardThunks';
import { LeaderboardState } from './typings';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    isLeaderboardLoading: false,
  } as LeaderboardState,
  reducers: {
    // addScore: () => {
    //   console.log('add score');
    // },
    // getAll: () => {
    //   console.log('get all');
    // },
  },
  extraReducers: builder => {
    builder

      //** get all */
      .addCase(leaderboardThunks.getAll.pending, state => {
        console.log('pending', state);
        state.isLeaderboardLoading = true;
      })
      .addCase(leaderboardThunks.getAll.fulfilled, (state, action) => {
        console.log('fullfilled', state);
        console.log(action);
        state.isLeaderboardLoading = false;
      })
      .addCase(leaderboardThunks.getAll.rejected, state => {
        console.log('rejected', state);
        state.isLeaderboardLoading = false;
      })

      //** add score */
      .addCase(leaderboardThunks.addScore.pending, state => {
        console.log('pending', state);
      })
      .addCase(leaderboardThunks.addScore.fulfilled, (state, action) => {
        console.log('fullfilled', state);
        console.log(action);
      })
      .addCase(leaderboardThunks.addScore.rejected, state => {
        console.log('rejected', state);
      });
  },
});

export const leaderboardSelectors = {
  all: (state: RootState) => state.leaderboard,
};

export const leaderboardActions = leaderboardSlice.actions;
export const leaderboardReducer = leaderboardSlice.reducer;
