import { Dispatch } from 'react';

import { FormInputAndHeadingList } from '../../../app.typings';

export type FormFieldListProps<FormType> = {
  formFieldList: FormInputAndHeadingList;
  formData: FormType;
  setFormData: Dispatch<FormType>;
  disabled?: boolean;
};
