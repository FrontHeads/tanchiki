import { type Params } from 'react-router-dom';

import { type FieldProps } from './components/Form/FieldList/Field/typings';

export type FormHeading = { heading: string };

export type FormInputAndHeadingList = (FieldProps | FormHeading)[];

export type UserProfile = {
  first_name?: string;
  avatar?: string;
  display_name?: string;
  email?: string;
  login?: string;
  phone?: string;
  second_name?: string;
  id?: number | null;
};

export type HandledMatch = {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: Record<string, (data: unknown) => JSX.Element>;
};
