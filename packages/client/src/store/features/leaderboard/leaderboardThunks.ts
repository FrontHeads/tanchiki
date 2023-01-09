import { createAsyncThunk } from '@reduxjs/toolkit';

import { leaderboardAPI, LeaderboardRecord, LeaderboardRequest } from './../../../api/leaderboardAPI';

export const addScore = createAsyncThunk('leaderboard/add', async (payload: LeaderboardRecord) => {
  const { data } = await leaderboardAPI.addScore(payload);
  return data;
});

export const getLeaderboard = createAsyncThunk('leaderboard/get', async (payload: LeaderboardRequest) => {
  const { data } = await leaderboardAPI.getLeaderboard(payload);
  return data;
});

export const leaderboardThunks = { addScore, getLeaderboard };
