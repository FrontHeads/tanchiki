import 'jest-fix-undefined';

import MockAdapter from 'axios-mock-adapter';

import { API_ENDPOINTS, LEADERBOARD_TEAM_NAME } from '../config/constants';
import { buildPath, HTTPClient } from '../utils/HTTP';
import { determineAPIHost } from '../utils/HTTP/determineAPIHost';
import {
  fakeForumSectionData,
  fakeForumSectionListData,
  fakeForumTopicData,
  fakeLeaderboardData,
  fakeUserProfile,
} from './data';

const baseUrl = determineAPIHost();
const mock = new MockAdapter(HTTPClient.getInstance().httpClient);

mock.onPost(buildPath(baseUrl, API_ENDPOINTS.LEADERBOARD.GET(LEADERBOARD_TEAM_NAME))).reply(200, fakeLeaderboardData);
mock.onGet(buildPath(baseUrl, API_ENDPOINTS.AUTH.ME)).reply(200, fakeUserProfile);
mock.onGet(buildPath(baseUrl, API_ENDPOINTS.THEMIZATION)).reply(200);

mock.onPost(buildPath(baseUrl, API_ENDPOINTS.AUTH.SIGNIN)).reply(200);
mock.onPost(buildPath(baseUrl, API_ENDPOINTS.AUTH.SIGNUP)).reply(200);
mock.onPost(buildPath(baseUrl, API_ENDPOINTS.AUTH.LOGOUT)).reply(200);
mock.onGet(buildPath(baseUrl, API_ENDPOINTS.FORUM.GET_SECTION_BY_ID(1))).reply(200, fakeForumSectionData);
mock.onGet(buildPath(baseUrl, API_ENDPOINTS.FORUM.GET_TOPIC_BY_ID(1))).reply(200, fakeForumTopicData);
mock.onGet(buildPath(baseUrl, API_ENDPOINTS.FORUM.GET_ALL_SECTIONS)).reply(200, fakeForumSectionListData);

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    ScrollRestoration: () => null,
  };
});

const AudioContext = jest.fn(() => ({
  createBufferSource: jest.fn(() => ({
    buffer: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createBuffer: jest.fn(),
  decodeAudioData: jest.fn(),
  currentTime: 0,
  resume: jest.fn(),
  suspend: jest.fn(),
}));

//@ts-expect-error - это мок, у него нет всех свойств реального AudioContext
window.AudioContext = AudioContext;
