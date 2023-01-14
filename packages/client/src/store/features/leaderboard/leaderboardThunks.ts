import { createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardAPI, LeaderboardRecord } from '../../../api/leaderboardAPI';
import {
  LEADERBOARD_RECORDS_DISPLAY_LIMIT,
  LEADERBOARD_DEFAULT_PAGE,
  LEADERBOARD_SORT_FIELD,
  LEADERBOARD_TEAM_NAME,
} from '../../../config/constants';

export const addScore = createAsyncThunk('leaderboard/add', async (payload: LeaderboardRecord) => {
  const { data } = await leaderboardAPI.addScore({
    data: payload,
    ratingFieldName: LEADERBOARD_SORT_FIELD,
    teamName: LEADERBOARD_TEAM_NAME,
  });
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
