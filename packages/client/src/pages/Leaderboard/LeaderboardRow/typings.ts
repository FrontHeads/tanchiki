type LeaderboardRowProps = {
  place: number;
  username: string;
  record: number;
  time: number;
  matches: number;
};

export type LeaderboardRecord = {
  row: LeaderboardRowProps;
};
