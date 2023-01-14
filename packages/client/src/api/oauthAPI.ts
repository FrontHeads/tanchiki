import { YANDEX_API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';

export type OauthPostRequestData = {
  code: string | null;
  redirect_uri: string;
};
export type OauthGetServiceRequestData = {
  redirect_uri: string;
};

type OauthGetServiceResponseData = { service_id: string };

type OauthPostResponseData = { reason: string } | 'OK';

export const oauthAPI = {
  getServiceId: (params: OauthGetServiceRequestData) =>
    HTTP.get<OauthGetServiceResponseData>(YANDEX_API_ENDPOINTS.AUTH.GETSERVICEID, { params }),

  postOauth: (data: OauthPostRequestData) => HTTP.post<OauthPostResponseData>(YANDEX_API_ENDPOINTS.AUTH.POST, { data }),
};
