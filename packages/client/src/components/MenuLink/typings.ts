/**
 * Уровни доступа
 * all - доступно всем
 * guest - только гостям
 * protected - только авторизованным
 */
type MenuLinkAccessLevel = 'all' | 'guest' | 'protected';

type MenuLinkProps = {
  name: string;
  title: string;
  to: string;
  accessLevel?: MenuLinkAccessLevel;
  onClick?: React.MouseEventHandler;
};

export type { MenuLinkProps };
