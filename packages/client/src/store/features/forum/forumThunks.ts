import { createAsyncThunk } from '@reduxjs/toolkit';

import { type createTopicRequestData, forumAPI } from '../../../api/forumAPI';

const createTopic = createAsyncThunk('forum/topic', async (payload: createTopicRequestData) => {
  const data = await forumAPI.createTopic(payload);
  console.log('create topic thunk', data);

  return data;
});

const getTopicsFromSection = createAsyncThunk('forum/topic/section_id', async (sectionId?: string) => {
  const { data } = await forumAPI.getTopicsFromSection(sectionId);
  return data;
});

const getAllSections = createAsyncThunk('forum/sections', async () => {
  const { data } = await forumAPI.getAllSections();
  return data;
});

export const forumThunks = { getAllSections, createTopic, getTopicsFromSection };
