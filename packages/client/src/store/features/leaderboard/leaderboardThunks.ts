import { createAsyncThunk } from '@reduxjs/toolkit';

import { leaderboardAPI } from '../../../api/leaderboardAPI/leaderboardAPI';
import { type LeaderboardRecordData } from '../../../api/leaderboardAPI/typings';
import {
  LEADERBOARD_DEFAULT_PAGE,
  LEADERBOARD_RECORDS_DISPLAY_LIMIT,
  LEADERBOARD_SORT_FIELD,
  LEADERBOARD_TEAM_NAME,
} from '../../../config/constants';

export const addScore = createAsyncThunk('leaderboard/add', async (payload: LeaderboardRecordData) => {
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
