import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';
import {
  type UpdatePasswordRequestData,
  type UpdatePasswordResponseData,
  type UpdateProfileAvatarRequestData,
  type UpdateProfileAvatarResponseData,
  type UpdateProfileRequestData,
  type UpdateProfileResponseData,
} from './typings';

export const userAPI = {
  updatePassword: (data: UpdatePasswordRequestData) =>
    HTTP.put<UpdatePasswordResponseData>(API_ENDPOINTS.USER.UPDATE_PASSWORD, { data }),

  updateProfile: (data: UpdateProfileRequestData) =>
    HTTP.put<UpdateProfileResponseData>(API_ENDPOINTS.USER.UPDATE_PROFILE, { data }),

  updateProfileAvatar: (data: UpdateProfileAvatarRequestData) => {
    return HTTP.put<UpdateProfileAvatarResponseData>(API_ENDPOINTS.USER.UPDATE_PROFILE_AVATAR, {
      data,
      headers: {},
    });
  },
};
