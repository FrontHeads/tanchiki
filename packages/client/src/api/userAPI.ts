import { type UserProfile } from '../app.typings';
import { API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';

export type UpdatePasswordRequestData = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateProfileRequestData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

export type UpdateProfileAvatarRequestData = FormData;

type UpdatePasswordResponseData = Record<string, never>;
type UpdateProfileResponseData = UserProfile;
type UpdateProfileAvatarResponseData = UserProfile;

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
