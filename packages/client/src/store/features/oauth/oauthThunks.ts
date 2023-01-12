import { createAsyncThunk } from '@reduxjs/toolkit';

import { oauthAPI } from '../../../api/oauthAPI';
import { PATH } from '../../../config/constants';

/**
 * Получаем serviceId и делаем редирект сперва на яндекс, а с яндекса на главную, с кодом авторизации.
 */
export const getOauthCode = createAsyncThunk('oauth/getOauthCode', async () => {
  const { data } = await oauthAPI.getServiceId({ redirect_uri: PATH.oauthRedirect });
  const url = new URL(PATH.yandexOauthUrl);

  url.searchParams.set('client_id', data.service_id);
  url.searchParams.set('redirect_uri', PATH.oauthRedirect);
  window.location.href = url.href;
});

/**
 * Пробуем авторизоваться
 */
export const tryOAuth = createAsyncThunk('oauth/tryOAuth', async (code: string) => {
  await oauthAPI.postOauth({ code: code, redirect_uri: PATH.oauthRedirect }).catch(() => null);
});

export const oauthThunks = { getServiceId: getOauthCode, tryOAuth };
