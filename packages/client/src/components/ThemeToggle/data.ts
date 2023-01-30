import { type ThemeList } from './typings';

export enum ThemeNames {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export const THEME_LIST: Array<ThemeList> = [
  {
    name: ThemeNames.Dark,
    viewBox: '0 0 32 32',
    svgPath:
      'M27.733 17.056c-.571 6.013-5.595 10.679-11.709 10.679-6.494 0-11.759-5.265-11.759-11.759 0-6.114 4.666-11.138 10.632-11.706l.047-.004a9.083 9.083 0 0 0-1.791 5.436 9.146 9.146 0 0 0 8.432 9.118l.031.002c2.185.164 4.354-.843 6.116-2.144v.38z',
  },
  {
    name: ThemeNames.Light,
    viewBox: '0 0 32 32',
    svgPath:
      'M16 22.667a6.667 6.667 0 0 0 0-13.334v0a6.667 6.667 0 0 0 0 13.334v0zm0-21.334V4m0 24v2.667M5.626 5.626 7.52 7.52m16.96 16.96 1.894 1.894M1.333 16H4m24 0h2.667M5.626 26.374 7.52 24.48M24.48 7.52l1.894-1.894',
  },
];
