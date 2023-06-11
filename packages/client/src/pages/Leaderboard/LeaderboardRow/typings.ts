import { type LeaderboardRecordData } from '../../../api/leaderboardAPI';

export type LeaderboardRowProps = {
  data: LeaderboardRecordData;
  place: number;
  isNarrowScreen: () => boolean;
};
