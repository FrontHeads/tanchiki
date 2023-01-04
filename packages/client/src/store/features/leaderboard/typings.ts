import { LeaderboardRowProps } from '../../../pages/Leaderboard/LeaderboardRow/typings';
import { LeaderboardFields, SortDirection } from './../../../pages/Leaderboard/typings';

export type LeaderboardState = {
  isLoading: boolean;
  leaderboard: LeaderboardRowProps[];
  fieldName: LeaderboardFields;
  sortDirection: SortDirection;
};
