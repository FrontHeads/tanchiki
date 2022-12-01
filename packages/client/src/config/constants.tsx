import defaultAvatar from '../assets/img/default-avatar.png';

export enum Paths {
  Home = '/',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  Game = '/game',
  UserProfile = '/profile',
  UserProfileEdit = '/profile/edit',
  Leaderboard = '/leaderboard',
}

export const PATH = {
  defaultAvatar,
  avatarBase: 'https://ya-praktikum.tech/api/v2/resources',
};

export const API_HOST = 'https://ya-praktikum.tech/api/v2';

export const API_ENDPOINTS = {
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
};
