import defaultAvatar from '../assets/img/default-avatar.png';

export enum Paths {
  Home = '/',
  Leaderboard = '/leaderboard',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  UserProfile = '/profile',
  UserProfileEdit = '/profile/edit',
}

export const PATH = {
  defaultAvatar,
  avatarBase: 'https://ya-praktikum.tech/api/v2/resources',
};

export const API_HOST = 'https://ya-praktikum.tech/api/v2';
