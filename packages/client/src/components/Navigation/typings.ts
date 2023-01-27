import { type NAVIGATION_LIST } from './data';
type NavigationProps = {
  exclude?: Array<typeof NAVIGATION_LIST[number]['name']>;
};
export type { NavigationProps };
