import type { LeaderboardRecord, UserDTO } from '../api/typings';

export const fakeUserProfile: UserDTO = {
  id: 1,
  display_name: 'User1',
  first_name: 'First Name',
  second_name: 'Second Name',
  email: 'example@mail.com',
  login: 'user1',
  avatar: '',
  phone: '555555',
};

export const fakeLeaderboardData: Array<LeaderboardRecord> = [
  {
    data: {
      rate: 1,
      time: 100,
      score: 200,
      matches: 6,
      username: 'User1',
    },
  },
  {
    data: {
      rate: 2,
      time: 200,
      score: 300,
      matches: 10,
      username: 'User2',
    },
  },
];
