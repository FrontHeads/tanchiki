import { type ThemeNames } from './data';

export type ThemeList = {
  name: ThemeNames;
  viewBox: string;
  svgPath: string;
  gatClassName?: () => string;
  onClick?: () => void;
};

export type toggleThemeArgs = {
  currentThemeName: string;
  skipServerRequest?: boolean;
};
