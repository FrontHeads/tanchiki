import { type ButtonHTMLAttributes, type MouseEventHandler, type ReactElement } from 'react';

export type DropdownMenuItems = {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type DropdownProps = {
  className?: string;
  trigger: ReactElement;
  emoteClass?: string;
  menuItems: DropdownMenuItems[];
};
