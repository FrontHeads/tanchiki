import { ButtonHTMLAttributes, MouseEventHandler, ReactElement } from 'react';

export type DropdownMenuItems = {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type DropdownProps = {
  trigger: ReactElement;
  menuItems: DropdownMenuItems[];
};
