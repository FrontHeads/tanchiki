import { type Dispatch, type FormHTMLAttributes } from 'react';

export type FormProps = {
  header?: string;
  children?: JSX.Element | JSX.Element[];
} & FormHTMLAttributes<HTMLFormElement>;

export type FormContextInitial = {
  isFormValidating: boolean;
  setIsFormValidating: Dispatch<boolean>;
};
