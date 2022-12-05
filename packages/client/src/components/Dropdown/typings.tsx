import { ReactElement } from 'react';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}
// type MenuItem = string;

type DropdownProps = {
  trigger: ReactElement;
  menu: ReactElement[];
};

export type { DropdownProps };
