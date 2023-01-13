import defaultAvatar from '/assets/img/default-avatar.png';

export const META_TITLE_SUFFIX = '- Тачники';

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

export const PATH = {
  defaultAvatar,
  avatarBase: 'https://ya-praktikum.tech/api/v2/resources',
};

export const YANDEX_API_HOST = 'https://ya-praktikum.tech/api/v2';

export const YANDEX_API_ENDPOINTS = {
  AUTH: {
    SIGNIN: 'auth/signin',
    SIGNUP: 'auth/signup',
    ME: 'auth/user',
    LOGOUT: 'auth/logout',
  },
  USER: {
    UPDATE_PASSWORD: 'user/password',
    UPDATE_PROFILE: 'user/profile',
    UPDATE_PROFILE_AVATAR: 'user/profile/avatar',
    SEARCH: 'user/search',
  },
  LEADERBOARD: {
    ADD_SCORE: '/leaderboard',
    GET: (teamName: string) => {
      return `/leaderboard/${teamName}`;
    },
  },
};

export const LEADERBOARD_TEAM_NAME = 'FrontHeadsTest';
export const LEADERBOARD_SORT_FIELD = 'score';
export const LEADERBOARD_DEFAULT_PAGE = 0;
export const LEADERBOARD_RECORDS_DISPLAY_LIMIT = 999;
