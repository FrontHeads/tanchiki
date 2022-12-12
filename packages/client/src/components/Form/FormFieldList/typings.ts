import { FormFieldProps } from '../../FormField/typings';

type FormFieldHeading = {
  heading: string;
};

type FormFieldListItem = FormFieldProps | FormFieldHeading;

export type FormFieldListProps = {
  formFieldList: FormFieldListItem[];
  formData: Record<string, string>;
};
