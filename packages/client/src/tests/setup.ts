import 'jest-fix-undefined';

import MockAdapter from 'axios-mock-adapter';

import { API_ENDPOINTS, LOCAL_API_HOST } from '../config/constants';
import { axios, buildPath } from '../utils/HTTP';
import { fakeUserProfile } from './data';

const mock = new MockAdapter(axios);
mock.onGet(buildPath(`http://localhost:${__SERVER_PORT__}`, '/')).reply(200);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.ME)).reply(200, fakeUserProfile);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.THEMIZATION)).reply(200);

mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.SIGNIN)).reply(200);
mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.SIGNUP)).reply(200);
mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.LOGOUT)).reply(200);

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    ScrollRestoration: () => null,
  };
});
