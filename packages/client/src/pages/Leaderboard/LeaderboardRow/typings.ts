type LeaderboardRecord = {
  place: number;
  username: string;
  record: number;
  time: number;
  matches: number;
};

export type LeaderboardRowProps = {
  row: LeaderboardRecord;
};
