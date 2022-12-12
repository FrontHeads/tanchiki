import { Dispatch } from 'react';

import { FormInputAndHeadingList } from '../../../app.typings';

export type FormFieldListProps<T> = {
  formFieldList: FormInputAndHeadingList;
  formData: T;
  setFormData: Dispatch<T>;
  disabled?: boolean;
};
