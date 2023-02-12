export type OAuthPostRequestData = {
  code: string | null;
  redirect_uri: string;
};
export type OAuthGetServiceRequestData = {
  redirect_uri: string;
};

export type OAuthGetServiceResponseData = { service_id: string };

export type OAuthPostResponseData = { reason: string } | 'OK';
