export type LeaderboardFilterProps = {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export type Filters = {
  username: string;
  score: MinMaxRange;
  rate: MinMaxRange;
  match: MinMaxRange;
};

type MinMaxRange = {
  min: number;
  max: number;
};
