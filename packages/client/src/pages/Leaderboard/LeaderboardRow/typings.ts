import { LeaderboardRecord } from '../../../api/leaderboardAPI';

export type LeaderboardRowProps = {
  data: LeaderboardRecord;
  place: number;
};
