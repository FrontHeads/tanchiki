type LeaderboardRecord = {
  place: number;
  username: string;
  record: number;
  time: number;
  matches: number;
};

export type ForumMessageProps = {
  id: number;
  content: string;
  time: string;
  userId: number;
  username: string;
};
