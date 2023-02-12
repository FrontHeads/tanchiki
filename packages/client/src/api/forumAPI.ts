import { API_ENDPOINTS } from '../config/constants';
import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { type ForumMessageT } from '../pages/Forum/ForumTopic/ForumMessage/typings';
import { type ForumTopicT } from '../pages/Forum/ForumTopic/typings';
import { HTTP } from '../utils/HTTP';

type createTopicRequestData = {
  name: string;
  section_id: number;
  content: string;
};

type createMessageRequestData = {
  topic_id: number;
  content: string;
};

type editMessageRequestData = {
  content: string;
};

type editTopicRequestData = {
  content: string;
};

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
  getSectionById: (sectionId: number) => HTTP.get<ForumSectionT>(API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(sectionId)),
  getTopicById: (topicId: number) => HTTP.get<ForumTopicT>(API_ENDPOINTS.FORUM.GET_TOPIC_BY_ID(topicId)),
  editTopic: (topicId: number, data: editTopicRequestData) =>
    HTTP.put<ForumTopicT>(API_ENDPOINTS.FORUM.EDIT_TOPIC(topicId), { data }),
  createTopic: (data: createTopicRequestData) => HTTP.post<ForumTopicT>(API_ENDPOINTS.FORUM.CREATE_TOPIC, { data }),
  createMessage: (data: createMessageRequestData) =>
    HTTP.post<ForumMessageT>(API_ENDPOINTS.FORUM.CREATE_MESSAGE, { data }),
  editMessage: (messageId: number, data: editMessageRequestData) =>
    HTTP.put<ForumMessageT>(API_ENDPOINTS.FORUM.EDIT_MESSAGE(messageId), { data }),
  deleteMessage: (messageId: number) => HTTP.delete(API_ENDPOINTS.FORUM.DELETE_MESSAGE(messageId)),
};
