import { Dispatch } from 'react';

import { FormInputAndHeadingList } from '../../../app.typings';
import { ValidationResponse } from '../../../utils/validation';

export type FieldListProps<T> = {
  setFile?: Dispatch<File>;
  fieldList: FormInputAndHeadingList;
  formData: T;
  setFormData: Dispatch<T>;
  submitRequested: boolean;
  disabled?: boolean;
  validation: (input: Record<string, string>) => ValidationResponse;
  submitHandler: () => void;
  // validationErrors: ValidationResponse;
  // setValidationErrors: Dispatch<ValidationResponse>;
};
