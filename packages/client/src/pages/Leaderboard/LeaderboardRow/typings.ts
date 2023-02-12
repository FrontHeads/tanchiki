import { type LeaderboardRecordData } from '../../../api/leaderboardAPI/typings';

export type LeaderboardRowProps = {
  data: LeaderboardRecordData;
  place: number;
};
