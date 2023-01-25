import { type ForumSectionItem } from '../pages/Forum/ForumSectionList/typings';
import { API_ENDPOINTS } from './../config/constants';
import { HTTP } from './../utils/HTTP/HTTP';

export const forumAPI = {
  getAllSections: () => HTTP.get<ForumSectionItem[]>(API_ENDPOINTS.FORUM.GET_ALL_SECTIONS),
};
