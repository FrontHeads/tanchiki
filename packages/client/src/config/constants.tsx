import DEFAULT_AVATAR from '/assets/img/default-avatar.png';

export { DEFAULT_AVATAR };

export const META_TITLE_SUFFIX = '- Танчики';

export enum Paths {
  Home = '/',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  Game = '/game',
  Forum = '/forum',
  Section = '/forum/section',
  Topic = '/topic',
  UserProfile = '/profile',
  UserProfileEdit = '/profile/edit',
  Leaderboard = '/leaderboard',
  Error404 = '404',
  Error500 = '500',
}

export const LOCAL_CLIENT_PORT = 3000;

export const LOCAL_SERVER_PORT = 5000;

export const PATH = {
  oauthRedirect: `http://localhost:${LOCAL_SERVER_PORT}`,
  yandexOAuthUrl: `https://oauth.yandex.ru/authorize?response_type=code`,
};

export const CLIENT_ONLY_HOSTS = [
  `localhost:${LOCAL_CLIENT_PORT}`,
  `127.0.0.1:${LOCAL_CLIENT_PORT}`,
  `frontheads.github.io`,
];

export const LOCAL_API_HOST = `http://localhost:${LOCAL_SERVER_PORT}/api`;

export const YANDEX_API_HOST = 'https://ya-praktikum.tech/api/v2';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: 'auth/signin',
    SIGNUP: 'auth/signup',
    ME: 'auth/user',
    LOGOUT: 'auth/logout',
  },
  OAUTH: {
    GET_SERVICE_ID: 'oauth/yandex/service-id',
    POST: 'oauth/yandex',
  },
  USER: {
    UPDATE_PASSWORD: 'user/password',
    UPDATE_PROFILE: 'user/profile',
    UPDATE_PROFILE_AVATAR: 'user/profile/avatar',
    SEARCH: 'user/search',
    GET_AVATAR: (avatarPath: string) => `resources${avatarPath}`,
  },
  LEADERBOARD: {
    ADD_SCORE: 'leaderboard',
    GET: (teamName: string) => `leaderboard/${teamName}`,
  },
  FORUM: {
    GET_ALL_SECTIONS: 'forum/section',
  },
};

export const LEADERBOARD_TEAM_NAME = 'FrontHeadsMain1';
export const LEADERBOARD_SORT_FIELD = 'score';
export const LEADERBOARD_DEFAULT_PAGE = 0;
export const LEADERBOARD_RECORDS_DISPLAY_LIMIT = 999;
