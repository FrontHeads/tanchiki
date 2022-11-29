import { InputProps } from './components/FormField/typings';

export type FormHeading = { heading: string };

export type FormInputAndHeadingList = (InputProps | FormHeading)[];

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
