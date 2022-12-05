type MenuLinkProps = {
  name: string;
  title: string;
  to: string;
  clickHandler?: () => Promise<void>;
};

export type { MenuLinkProps };
