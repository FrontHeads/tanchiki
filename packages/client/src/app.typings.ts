import { type Params } from 'react-router-dom';

import { type FieldProps } from './components/Form/FieldList/Field/typings';

export type FormHeading = { heading: string };

export type FormInputAndHeadingList = (FieldProps | FormHeading)[];

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
