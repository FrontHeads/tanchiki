import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LeaderboardRowProps } from './../../../pages/Leaderboard/LeaderboardRow/typings';
import { LeaderboardFields, SortDirection } from './../../../pages/Leaderboard/typings';
import { RootState } from './../../store';
import { leaderboardThunks } from './leaderboardThunks';
import { LeaderboardState } from './typings';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    isLoading: false,
    leaderboard: [],
    fieldName: 'username',
    sortDirection: 'asc',
  } as LeaderboardState,

  reducers: {
    setSortParams: (
      state,
      {
        payload,
      }: PayloadAction<{
        fieldName: LeaderboardFields;
        sortDirection: SortDirection;
      }>
    ) => {
      state.fieldName = payload.fieldName;
      state.sortDirection = payload.sortDirection;
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
  sortedData: ({ leaderboard: leaderboardState }: RootState) => {
    const { fieldName, sortDirection, leaderboard } = leaderboardState;

    if (fieldName === 'username') {
      return [...leaderboard].sort((a: LeaderboardRowProps, b: LeaderboardRowProps) => {
        const string_1 = String(a.data[fieldName]);
        const string_2 = String(b.data[fieldName]);

        switch (sortDirection) {
          case 'desc':
            return string_1.localeCompare(string_2);
          case 'asc':
            return string_2.localeCompare(string_1);
        }
      });
    }

    return [...leaderboard].sort((a, b) => {
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
};

export const leaderboardActions = leaderboardSlice.actions;
export const leaderboardReducer = leaderboardSlice.reducer;
