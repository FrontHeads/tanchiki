type MenuLinkProps = {
  name: string;
  title: string;
  to: string;
  onClick?: () => Promise<void>;
};

export type { MenuLinkProps };
