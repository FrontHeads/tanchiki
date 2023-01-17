import { type ButtonHTMLAttributes, type MouseEventHandler } from 'react';

import { type ButtonVariant } from './data';

export type ButtonProps = {
  text: string;
  type?: string;
  variant?: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;
