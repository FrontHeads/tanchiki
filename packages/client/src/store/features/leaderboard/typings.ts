import { LeaderboardRecord } from '../../../api/typings';

export type SortOption = 'username' | 'score' | 'time' | 'matches';

export type SortDirection = 'asc' | 'desc';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboardTable: Array<LeaderboardRecord>;
  sortOption: SortOption;
  sortDirection: SortDirection;
};
