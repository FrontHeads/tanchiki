import { type Dispatch, type SetStateAction } from 'react';

import { type FormInputAndHeadingList } from '../../../app.typings';
import { type useValidation } from '../../../utils/validation';

export type FieldListProps<T> = {
  setFile?: Dispatch<File>;
  fieldList: FormInputAndHeadingList;
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  disabled?: boolean;
  isFormSubmitted: boolean;
  validation: ReturnType<typeof useValidation>;
  onFormSubmitCallback: () => void;
  setIsFormSubmitted: (value: boolean) => void;
};
