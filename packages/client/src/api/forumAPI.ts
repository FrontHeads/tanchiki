import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { API_ENDPOINTS } from './../config/constants';
import { HTTP } from './../utils/HTTP/HTTP';

export type createTopicRequestData = {
  id: number;
  user_id: number;
  section_id: string;
  name: string;
  content: string;
  username: string;
  messages: number;
};

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
  getTopicsFromSection: (sectionId?: string) => HTTP.get(API_ENDPOINTS.FORUM.GET_TOPICS_FROM_SECTION(sectionId)),
  createTopic: (data: createTopicRequestData) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_TOPIC, { data }),
};
