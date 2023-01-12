import { createAsyncThunk } from '@reduxjs/toolkit';

import { type LeaderboardRecord,leaderboardAPI } from '../../../api/leaderboardAPI';
import { LEADERBOARD_RECORDS_DISPLAY_LIMIT, LEADERBOARD_SORT_FIELD } from '../../../config/constants';
import { LEADERBOARD_DEFAULT_PAGE } from './../../../config/constants';

export const addScore = createAsyncThunk('leaderboard/add', async (payload: LeaderboardRecord) => {
  const { data } = await leaderboardAPI.addScore(payload);
  return data;
});

export const getLeaderboard = createAsyncThunk('leaderboard/get', async () => {
  const { data } = await leaderboardAPI.getLeaderboard({
    ratingFieldName: LEADERBOARD_SORT_FIELD,
    cursor: LEADERBOARD_DEFAULT_PAGE,
    limit: LEADERBOARD_RECORDS_DISPLAY_LIMIT,
  });
  return data;
});

export const leaderboardThunks = { addScore, getLeaderboard };
