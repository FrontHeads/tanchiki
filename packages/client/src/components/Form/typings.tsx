import { FormEvent, FormHTMLAttributes } from 'react';

export type FormProps = {
  hasErrors: boolean;
  header?: string;
  handlerSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;
