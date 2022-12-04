import { API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';
import { UserDTO } from './typings';

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
type UpdateProfileResponseData = UserDTO;
type UpdateProfileAvatarResponseData = UserDTO;

export const userAPI = {
  updatePassword: (data: UpdatePasswordRequestData) =>
    HTTP.put<UpdatePasswordResponseData>(API_ENDPOINTS.USER.UPDATE_PASSWORD, { data }),

  updateProfile: (data: UpdateProfileRequestData) =>
    HTTP.put<UpdateProfileResponseData>(API_ENDPOINTS.USER.UPDATE_PROFILE, { data }),

  updateProfileAvatar: (data: UpdateProfileAvatarRequestData) => {
    console.log('up', data);

    return HTTP.put<UpdateProfileAvatarResponseData>(API_ENDPOINTS.USER.UPDATE_PROFILE_AVATAR, { data, headers: {} });
  },
};
