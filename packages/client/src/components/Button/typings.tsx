import { ButtonHTMLAttributes } from 'react';
// import { FieldError } from 'react-hook-form';

type ButtonProps = {
  text: string;
  type?: string;
  selector?: string;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type { ButtonProps };
