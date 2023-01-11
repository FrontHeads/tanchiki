export type LeaderboardRecord = {
  place: number;
  username: string;
  score: number;
  time: number;
  matches: number;
};

export type LeaderboardRowProps = {
  data: LeaderboardRecord;
};
