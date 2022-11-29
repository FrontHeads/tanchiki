import { FormEvent, FormHTMLAttributes } from 'react';

export type FormProps = {
  header?: string;
  handlerSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;
