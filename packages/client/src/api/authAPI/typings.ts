import { type UserProfile } from '../../app.typings';

export type SigninRequestData = {
  login: string;
  password: string;
};

export type SignupRequestData = {
  login: string;
  password: string;
  password_check: string;
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
};

export type SigninResponseData = Record<string, never>;
export type SignupResponseData = { id: number };
export type UserResponseData = UserProfile;
