type MenuLinkProps = {
  id: string | number;
  title: string;
  to: string;
  clickHandler?: () => Promise<void>;
};

export type { MenuLinkProps };
