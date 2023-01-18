import { API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';
import { type UserDTO } from './typings';

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

type SigninResponseData = Record<string, never>;
type SignupResponseData = { id: number };
type UserResponseData = UserDTO;

export const authAPI = {
  signin: (data: SigninRequestData) => HTTP.post<SigninResponseData>(API_ENDPOINTS.AUTH.SIGNIN, { data }),

  signup: (data: SignupRequestData) => HTTP.post<SignupResponseData>(API_ENDPOINTS.AUTH.SIGNUP, { data }),

  me: () => HTTP.get<UserResponseData>(API_ENDPOINTS.AUTH.ME),

  logout: () => HTTP.post(API_ENDPOINTS.AUTH.LOGOUT),
};
