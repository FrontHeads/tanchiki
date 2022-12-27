import { createAsyncThunk } from '@reduxjs/toolkit';

import { leaderboardAPI } from './../../../api/leaderboardAPI';

export const addScore = createAsyncThunk('leaderboard', async (payload: any) => {
  const { data } = await leaderboardAPI.addScore(payload);
  return data;
});

export const getAll = createAsyncThunk('leaderboard/getall', async (payload: any) => {
  const { data } = await leaderboardAPI.getAll(payload);
  return data;
});

export const leaderboardThunks = { addScore, getAll };
