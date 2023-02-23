import { NAVIGATION_LIST } from '../components/Navigation/data';
import { isClientOnlyHost } from './HTTP';
import { type MenuLinkProps } from '../components/MenuLink/typings';

/**
 * Фильтруем пункты меню в зависимости от того - достуен ли
 * раздел авторизованному пользователю/гостю или нет
 */
export const getFilteredNavigationList = (
  isAuthenticated = false,
  exclude?: Array<typeof NAVIGATION_LIST[number]['name']>
) => {
  return NAVIGATION_LIST.filter(link => {
    if (exclude?.length && exclude.includes(link.name)) {
      return false;
    }

    if ('accessLevel' in link && link.accessLevel === 'guest' && isAuthenticated) {
      return false;
    }

    if ('accessLevel' in link && link.accessLevel === 'protected' && !isAuthenticated) {
      return false;
    }

    return true;
  }).map((link: MenuLinkProps) => {
    if ('displayOption' in link && link.displayOption === 'disableIfClientOnly' && isClientOnlyHost()) {
      link.disabled = true;
    }

    return link;
  });
};
