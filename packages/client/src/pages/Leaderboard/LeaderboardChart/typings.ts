export type LeaderboardChartProps = {
  filteredData: (JSX.Element | undefined)[];
};

export type ChartDataArgs = {
  usernames: string[];
  rates: number[];
  matches: number[];
  scores: number[];
};
