import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';
import {
  type SigninRequestData,
  type SigninResponseData,
  type SignupRequestData,
  type SignupResponseData,
  type UserResponseData,
} from './typings';

export const authAPI = {
  signin: (data: SigninRequestData) => HTTP.post<SigninResponseData>(API_ENDPOINTS.AUTH.SIGNIN, { data }),

  signup: (data: SignupRequestData) => HTTP.post<SignupResponseData>(API_ENDPOINTS.AUTH.SIGNUP, { data }),

  me: () => HTTP.get<UserResponseData>(API_ENDPOINTS.AUTH.ME),

  logout: () => HTTP.post(API_ENDPOINTS.AUTH.LOGOUT),
};
