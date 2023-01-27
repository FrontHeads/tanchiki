import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { API_ENDPOINTS } from './../config/constants';
import { HTTP } from './../utils/HTTP/HTTP';

export type createTopicRequestData = {
  name: string;
  section_id: number;
  user_id: number;
  username: string;
  content: string;
};

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
  getSectionById: (sectionId: number) => HTTP.get<ForumSectionT>(API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(sectionId)),
  getTopicsFromSection: (sectionId?: number) => HTTP.get(API_ENDPOINTS.FORUM.GET_TOPICS_FROM_SECTION(sectionId)),
  createTopic: (data: createTopicRequestData) => HTTP.post(API_ENDPOINTS.FORUM.CREATE_TOPIC, { data }),
};
