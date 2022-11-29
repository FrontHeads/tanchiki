import { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  text: string;
  type?: string;
  selector?: string;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type { ButtonProps };
