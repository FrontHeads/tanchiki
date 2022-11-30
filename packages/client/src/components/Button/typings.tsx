import { ButtonHTMLAttributes } from 'react';

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
}

type ButtonProps = {
  text: string;
  type?: string;
  variant?: ButtonVariant;
  testId?: string;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type { ButtonProps };
