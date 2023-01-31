import { createAsyncThunk } from '@reduxjs/toolkit';

import { type createTopicRequestData, forumAPI } from '../../../api/forumAPI';
import { type MessageRequest } from './typings';

const createTopic = createAsyncThunk('forum/topic', async (payload: createTopicRequestData) => {
  const data = await forumAPI.createTopic(payload);

  return data;
});

const getTopicsFromSection = createAsyncThunk('forum/topic/section_id', async (sectionId?: number) => {
  const { data } = await forumAPI.getTopicsFromSection(sectionId);
  return data;
});

const getAllSections = createAsyncThunk('forum/sections', async () => {
  const { data } = await forumAPI.getAllSections();
  return data;
});

const createMessage = createAsyncThunk('forum/message', async (message: MessageRequest) => {
  const { data } = await forumAPI.createMessage(message);
  return data;
});

export const forumThunks = { getAllSections, createTopic, getTopicsFromSection, createMessage };
