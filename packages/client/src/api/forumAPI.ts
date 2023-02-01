import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { type ForumMessage } from '../pages/Forum/ForumTopic/ForumMessage/typings';
import { type ForumTopicT } from '../pages/Forum/ForumTopic/typings';
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

type editMessageRequest = {
  content: string;
};
type editTopicRequest = {
  content: string;
};

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
  getSectionById: (sectionId: number) => HTTP.get<ForumSectionT>(API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(sectionId)),
  getTopicsFromSection: (sectionId?: number) => HTTP.get(API_ENDPOINTS.FORUM.GET_TOPICS_FROM_SECTION(sectionId)),
  getTopicById: (topicId: number) => HTTP.get<ForumTopicT>(API_ENDPOINTS.FORUM.GET_TOPIC_BY_ID(topicId)),
  editTopic: (topicId: number, data: editTopicRequest) =>
    HTTP.put<ForumTopicT>(API_ENDPOINTS.FORUM.EDIT_TOPIC(topicId), { data }),
  createTopic: (data: createTopicRequestData) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_TOPIC, { data }),
  createMessage: (data: MessageRequest) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_MESSAGE, { data }),
  editMessage: (messageId: number, data: editMessageRequest) =>
    HTTP.put<ForumMessage>(API_ENDPOINTS.FORUM.EDIT_MESSAGE(messageId), { data }),
  deleteMessage: (messageId: number) => HTTP.delete(API_ENDPOINTS.FORUM.DELETE_MESSAGE(messageId)),
};
