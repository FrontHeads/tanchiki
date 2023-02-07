import defaultAvatarPath from '../../public/assets/img/default-avatar.png';
import { API_ENDPOINTS } from '../config/constants';
import { buildPath, determineAPIHost } from './HTTP';

export const getAvatar = (path: string) => {
  if (path) {
    return buildPath(determineAPIHost(), API_ENDPOINTS.USER.GET_AVATAR(path));
  }

  return defaultAvatarPath;
};
