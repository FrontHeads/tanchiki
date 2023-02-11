import 'jest-fix-undefined';

import MockAdapter from 'axios-mock-adapter';

import { API_ENDPOINTS, LEADERBOARD_TEAM_NAME, LOCAL_API_HOST } from '../config/constants';
import { buildPath, HTTPClient } from '../utils/HTTP';
import {
  fakeForumSectionData,
  fakeForumSectionListData,
  fakeForumTopicData,
  fakeLeaderboardData,
  fakeUserProfile,
} from './data';

const mock = new MockAdapter(HTTPClient.getInstance().httpClient);
mock.onGet(buildPath(`http://localhost:${__SERVER_PORT__}`, '/')).reply(200);

mock
  .onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.LEADERBOARD.GET(LEADERBOARD_TEAM_NAME)))
  .reply(200, fakeLeaderboardData);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.ME)).reply(200, fakeUserProfile);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.THEMIZATION)).reply(200);

mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.SIGNIN)).reply(200);
mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.SIGNUP)).reply(200);
mock.onPost(buildPath(LOCAL_API_HOST, API_ENDPOINTS.AUTH.LOGOUT)).reply(200);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(1))).reply(200, fakeForumSectionData);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.FORUM.GET_TOPIC_BY_ID(1))).reply(200, fakeForumTopicData);
mock.onGet(buildPath(LOCAL_API_HOST, API_ENDPOINTS.FORUM.GET_ALL_SECTIONS)).reply(200, fakeForumSectionListData);

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    ScrollRestoration: () => null,
  };
});
