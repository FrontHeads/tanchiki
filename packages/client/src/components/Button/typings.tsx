import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

type ButtonProps = {
  text: string;
  type?: string;
  variant?: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type { ButtonProps };
