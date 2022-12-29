import { FieldProps } from './components/Form/FieldList/Field/typings';

export type AppProps = { isSsr?: boolean };

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
