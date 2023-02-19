import { type FormHTMLAttributes } from 'react';

export type FormProps = {
  header?: string;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;
