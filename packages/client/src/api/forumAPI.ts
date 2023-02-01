import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { type ForumMessage } from '../pages/Forum/ForumTopic/ForumMessage/typings';
import { type User } from './../../../server/models/User';
import { API_ENDPOINTS } from './../config/constants';
import { type MessageRequest } from './../store/features/forum/typings';
import { HTTP } from './../utils/HTTP/HTTP';

export type createTopicRequestData = {
  name: string;
  section_id: number;
  user_id: number;
  username: string;
  content: string;
};

export type getTopicByIdResponse = {
  content: string;
  created_at: string;
  id: number;
  messages: ForumMessage[];
  name: string;
  section: ForumSectionT;
  section_id: number;
  updated_at: string;
  user_id: number;
  user: User;
  username: string;
};

type editMessageRequest = {
  content: string;
};

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
  getSectionById: (sectionId: number) => HTTP.get<ForumSectionT>(API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(sectionId)),
  getTopicsFromSection: (sectionId?: number) => HTTP.get(API_ENDPOINTS.FORUM.GET_TOPICS_FROM_SECTION(sectionId)),
  getTopicById: (topicId: number) => HTTP.get<getTopicByIdResponse>(API_ENDPOINTS.FORUM.GET_TOPIC_BY_ID(topicId)),
  createTopic: (data: createTopicRequestData) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_TOPIC, { data }),
  createMessage: (data: MessageRequest) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_MESSAGE, { data }),
  editMessage: (messageId: number, data: editMessageRequest) =>
    HTTP.put<ForumMessage>(API_ENDPOINTS.FORUM.EDIT_MESSAGE(messageId), { data }),
  deleteMessage: (messageId: number) => HTTP.delete(API_ENDPOINTS.FORUM.DELETE_MESSAGE(messageId)),
};
