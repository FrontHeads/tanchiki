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

  reducers: {
    sortLeaderboard: (state, action) => {
      const fieldName = action.payload.fieldName;
      const sortDirection = action.payload.direction;

      if (fieldName === 'username') {
        state.leaderboard = state.leaderboard.sort((a, b) => {
          const string_1 = a.data[fieldName];
          const string_2 = b.data[fieldName];

          switch (sortDirection) {
            case 'desc':
              return string_1.localeCompare(string_2);
            case 'asc':
              return string_2.localeCompare(string_1);
          }
        });
      }

      state.leaderboard = state.leaderboard.sort((a, b) => {
        switch (sortDirection) {
          case 'desc':
            return a.data[fieldName] - b.data[fieldName];
          case 'asc':
            return b.data[fieldName] - a.data[fieldName];
          default:
            return 0;
        }
      });
    },
  },

  extraReducers: builder => {
    builder

      //** get leaderboard */
      .addCase(leaderboardThunks.getLeaderboard.pending, state => {
        state.isLoading = true;
      })
      .addCase(leaderboardThunks.getLeaderboard.fulfilled, (state, { payload }) => {
        state.leaderboard = payload;
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
