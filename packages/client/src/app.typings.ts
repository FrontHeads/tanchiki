import { type Params } from 'react-router-dom';

import { type FieldProps } from './components/Form/FieldList/Field/typings';

export type FormHeading = { heading: string; id: string };

export type FormInputAndHeading = FieldProps | FormHeading;

export type FormInputAndHeadingList = FormInputAndHeading[];

export type APIError = {
  reason: string;
};

export type UserProfile = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  email: string;
  phone: string;
};

export type HandledMatch = {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: Record<string, (data: unknown) => JSX.Element>;
};

export function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj && key !== 'username';
}
