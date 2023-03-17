export type LeaderboardFilterProps = {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export type Filters = {
  username: string;
  score: { min: number; max: number };
  rate: { min: number; max: number };
  match: { min: number; max: number };
};
