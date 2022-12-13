import { Dispatch } from 'react';

import { FormInputAndHeadingList } from '../../../app.typings';

export type FieldListProps<T> = {
  fieldList: FormInputAndHeadingList;
  formData: T;
  setFormData: Dispatch<T>;
  disabled?: boolean;
};
