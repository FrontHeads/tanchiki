import { Dispatch } from 'react';

import { FormInputAndHeadingList } from '../../../app.typings';
import { useValidation } from '../../../utils/validation';

export type FieldListProps<T> = {
  setFile?: Dispatch<File>;
  fieldList: FormInputAndHeadingList;
  formData: T;
  setFormData: Dispatch<T>;
  // submitRequested: boolean;
  disabled?: boolean;
  isFormSubmitted: boolean;
  // validation?: (input: Record<string, string>) => ValidationResponse;
  validation: ReturnType<typeof useValidation>;
  // submitHandler: () => void;
  setFormHasErrors: (hasErrors: boolean) => void;
  // validationErrors: ValidationResponse;
  // setValidationErrors: Dispatch<ValidationResponse>;
};
