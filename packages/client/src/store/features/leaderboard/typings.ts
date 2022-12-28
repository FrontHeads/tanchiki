import { LeaderboardRowProps } from '../../../pages/Leaderboard/LeaderboardRow/typings';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboard: LeaderboardRowProps[];
};
