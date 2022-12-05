type MenuLinkProps = {
  id: string | number;
  title: string;
  to: string;
  onClick?: () => Promise<void>;
};

export type { MenuLinkProps };
