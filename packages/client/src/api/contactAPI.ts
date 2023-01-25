import { API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';

export type SendRequestData = {
  name: string;
  email: string;
  message: string;
};

export const contactAPI = {
  send: (data: SendRequestData) => HTTP.post<void>(API_ENDPOINTS.CONTACT.SEND, { data }),
};
