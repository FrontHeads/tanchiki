import { LeaderboardRowProps } from '../../../pages/Leaderboard/LeaderboardRow/typings';
import { SortDirection, SortOption } from './../../../pages/Leaderboard/typings';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboardTable: LeaderboardRowProps[];
  sortOption: SortOption;
  sortDirection: SortDirection;
};
