import { createAsyncThunk } from '@reduxjs/toolkit';

import { forumAPI } from '../../../api/forumAPI';

// export const createTopic = createAsyncThunk('forum/topic', async (payload: any) => {
//   const { data } = await forumAPI.createTopic({
//     data: payload,
//   });
//   return data;
// });

const getAllSections = createAsyncThunk('forum/sections', async () => {
  const { data } = await forumAPI.getAllSections();
  return data;
});

export const forumThunks = { getAllSections };
