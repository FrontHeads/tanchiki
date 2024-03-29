import { type LeaderboardRecord } from '../../../api/leaderboardAPI';

export type SortOption = 'username' | 'score' | 'time' | 'matches' | 'rate';

export type SortDirection = 'asc' | 'desc';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboardTable: Array<LeaderboardRecord>;
  sortOption: SortOption;
  sortDirection: SortDirection;
};
