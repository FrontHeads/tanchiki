import { type UserProfile } from '../../app.typings';

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

export type UpdatePasswordResponseData = Record<string, never>;
export type UpdateProfileResponseData = UserProfile;
export type UpdateProfileAvatarResponseData = UserProfile;
