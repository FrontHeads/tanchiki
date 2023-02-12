import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';
import {
  type OAuthGetServiceRequestData,
  type OAuthGetServiceResponseData,
  type OAuthPostRequestData,
  type OAuthPostResponseData,
} from './typings';

export const oauthAPI = {
  getServiceId: (params: OAuthGetServiceRequestData) =>
    HTTP.get<OAuthGetServiceResponseData>(API_ENDPOINTS.OAUTH.GET_SERVICE_ID, { params }),

  postOAuth: (data: OAuthPostRequestData) => HTTP.post<OAuthPostResponseData>(API_ENDPOINTS.OAUTH.POST, { data }),
};
