import { createAsyncThunk } from '@reduxjs/toolkit';

import { oauthAPI } from '../../../api/oauthAPI';
import { PATH } from '../../../config/constants';

/**
 * Получаем serviceId и делаем редирект сперва на яндекс, а с яндекса на главную, с кодом авторизации.
 */
export const getOAuthCode = createAsyncThunk('oauth/getOauthCode', async () => {
  const { data } = await oauthAPI.getServiceId({ redirect_uri: PATH.oauthRedirect });

  const url = new URL(PATH.yandexOAuthUrl);

  url.searchParams.set('client_id', data.service_id);
  url.searchParams.set('redirect_uri', PATH.oauthRedirect);
  window.location.href = url.href;
});

export const oauthThunks = { getOAuthCode };
