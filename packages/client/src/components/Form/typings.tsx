import { FormEvent, FormHTMLAttributes } from 'react';

export type FormProps = {
  hasErrors: boolean;
  header?: string;
  onSubmitHandler: (e: FormEvent<HTMLFormElement>) => void;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;
