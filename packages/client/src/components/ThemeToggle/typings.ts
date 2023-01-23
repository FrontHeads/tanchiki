import { type ThemeNames } from './data';

export type ThemeList = {
  name: ThemeNames;
  viewBox: string;
  svgPath: string;
  gatClassName?: () => string;
  onClick?: () => void;
};
