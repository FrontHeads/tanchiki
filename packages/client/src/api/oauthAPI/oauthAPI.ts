import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';

export type OAuthPostRequestData = {
  code: string | null;
  redirect_uri: string;
};
export type OAuthGetServiceRequestData = {
  redirect_uri: string;
};

type OAuthGetServiceResponseData = { service_id: string };

type OAuthPostResponseData = { reason: string } | 'OK';

export const oauthAPI = {
  getServiceId: (params: OAuthGetServiceRequestData) =>
    HTTP.get<OAuthGetServiceResponseData>(API_ENDPOINTS.OAUTH.GET_SERVICE_ID, { params }),

  postOAuth: (data: OAuthPostRequestData) => HTTP.post<OAuthPostResponseData>(API_ENDPOINTS.OAUTH.POST, { data }),
};
