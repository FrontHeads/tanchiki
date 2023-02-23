/**
 * Уровни доступа
 * all - доступно всем
 * guest - только гостям
 * protected - только авторизованным
 */
type MenuLinkAccessLevel = 'all' | 'guest' | 'protected';

type MenuLinkDisplayOption = 'disableIfClientOnly';

type MenuLinkProps = {
  name: string;
  title: string;
  to: string;
  accessLevel?: MenuLinkAccessLevel;
  displayOption?: MenuLinkDisplayOption;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
};

export type { MenuLinkProps };
