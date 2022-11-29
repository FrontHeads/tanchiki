export enum Paths {
  Home = '/',
  Leaderboard = '/leaderboard',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
}

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
