import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type ButtonProps = {
  text: string;
  type?: string;
  variant?: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;
