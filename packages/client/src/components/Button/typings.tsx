import { ButtonHTMLAttributes } from 'react';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

type ButtonProps = {
  text: string;
  type?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type { ButtonProps };
