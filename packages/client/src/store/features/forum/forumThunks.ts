import { createAsyncThunk } from '@reduxjs/toolkit';

import { forumAPI } from '../../../api/forumAPI';
import { type MessageRequest } from './typings';

const createMessage = createAsyncThunk('forum/message', async (message: MessageRequest) => {
  const { data } = await forumAPI.createMessage(message);
  return data;
});

export const forumThunks = { createMessage };
