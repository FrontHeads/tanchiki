import { type LeaderboardRowProps } from '../../../pages/Leaderboard/LeaderboardRow/typings';
import { type SortDirection, type SortOption } from './../../../pages/Leaderboard/typings';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboardTable: LeaderboardRowProps[];
  sortOption: SortOption;
  sortDirection: SortDirection;
};
