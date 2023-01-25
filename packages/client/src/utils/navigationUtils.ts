import { NAVIGATION_LIST } from './../components/Navigation/data';

export const getFilteredNavigationList = (
  isAuthenticated = false,
  exclude?: Array<typeof NAVIGATION_LIST[number]['name']>
) => {
  return NAVIGATION_LIST.filter(link => {
    if (exclude?.length && exclude.includes(link.name)) {
      return false;
    }

    if ('public' in link && link.public && isAuthenticated) {
      return false;
    }

    if ('protected' in link && link.protected && !isAuthenticated) {
      return false;
    }

    return true;
  });
};
