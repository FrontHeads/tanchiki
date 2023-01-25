type MenuLinkProps = {
  name: string;
  title: string;
  to: string;
  protected?: boolean;
  public?: boolean;
  onClick?: () => void;
};

export type { MenuLinkProps };
