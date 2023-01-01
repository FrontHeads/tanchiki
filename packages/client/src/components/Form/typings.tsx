import { FormEvent, FormHTMLAttributes } from 'react';

export type FormProps = {
  header?: string;
  onSubmitHandler: (e: FormEvent<HTMLFormElement>) => void;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;
