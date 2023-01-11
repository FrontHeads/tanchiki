import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LeaderboardRowProps } from './../../../pages/Leaderboard/LeaderboardRow/typings';
import { SortOption } from './../../../pages/Leaderboard/typings';
import { RootState } from './../../store';
import { leaderboardThunks } from './leaderboardThunks';
import { LeaderboardState } from './typings';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    isLoading: false,
    leaderboardTable: [],
    sortOption: 'score',
    sortDirection: 'desc',
  } as LeaderboardState,

  reducers: {
    setSortParams: (
      state,
      {
        payload,
      }: PayloadAction<{
        sortOption: SortOption;
      }>
    ) => {
      state.sortOption = payload.sortOption;
      state.sortDirection === 'desc' ? (state.sortDirection = 'asc') : (state.sortDirection = 'desc');
    },
  },

  extraReducers: builder => {
    builder
      //** get leaderboard */
      .addCase(leaderboardThunks.getLeaderboard.pending, state => {
        state.isLoading = true;
      })
      .addCase(leaderboardThunks.getLeaderboard.fulfilled, (state, { payload }) => {
        state.leaderboardTable = payload;
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

const sortParamsSelector = ({ leaderboard: { sortOption, sortDirection, leaderboardTable } }: RootState) => {
  return { sortOption, sortDirection, leaderboardTable };
};

export const sortedLeaderboardSelector = createSelector(
  sortParamsSelector,
  ({ sortOption, sortDirection, leaderboardTable }) => {
    if (sortOption === 'username') {
      return [...leaderboardTable].sort((a: LeaderboardRowProps, b: LeaderboardRowProps) => {
        const string_1 = String(a.data[sortOption]);
        const string_2 = String(b.data[sortOption]);

        switch (sortDirection) {
          case 'desc':
            return string_1.localeCompare(string_2);
          case 'asc':
            return string_2.localeCompare(string_1);
        }
      });
    }

    return [...leaderboardTable].sort((a, b) => {
      switch (sortDirection) {
        case 'asc':
          return a.data[sortOption] - b.data[sortOption];
        case 'desc':
          return b.data[sortOption] - a.data[sortOption];
        default:
          return 0;
      }
    });
  }
);

export const leaderboardSelectors = {
  all: (state: RootState) => state.leaderboard,
  sortedData: sortedLeaderboardSelector,
};

export const leaderboardActions = leaderboardSlice.actions;
export const leaderboardReducer = leaderboardSlice.reducer;