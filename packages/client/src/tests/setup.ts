import 'jest-fix-undefined';

import MockAdapter from 'axios-mock-adapter';

import { YANDEX_API_ENDPOINTS, YANDEX_API_HOST } from '../config/constants';
import { axios, buildPath } from '../utils/HTTP';
import { fakeUserProfile } from './data';

const mock = new MockAdapter(axios);
mock.onGet(buildPath(`http://localhost:${__SERVER_PORT__}`, '/')).reply(200);

mock.onGet(buildPath(YANDEX_API_HOST, YANDEX_API_ENDPOINTS.AUTH.ME)).reply(200, fakeUserProfile);
mock.onPost(buildPath(YANDEX_API_HOST, YANDEX_API_ENDPOINTS.AUTH.SIGNIN)).reply(200);
mock.onPost(buildPath(YANDEX_API_HOST, YANDEX_API_ENDPOINTS.AUTH.SIGNUP)).reply(200);
mock.onPost(buildPath(YANDEX_API_HOST, YANDEX_API_ENDPOINTS.AUTH.LOGOUT)).reply(200);

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    ScrollRestoration: () => null,
  };
});
