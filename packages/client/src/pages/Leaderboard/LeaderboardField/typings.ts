import { LeaderboardFields } from './../typings';
export type LeaderboardFieldProps = {
  fieldName: string;
  sortOption?: LeaderboardFields;
  onClick: ({ fieldName, value }: any) => void;
};
