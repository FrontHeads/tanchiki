import { type Dispatch, type SetStateAction } from 'react';

import { type FormInputAndHeadingList } from '../../../app.typings';

export type FieldListProps<T> = {
  setFile?: Dispatch<File>;
  fieldList: FormInputAndHeadingList;
  hidingFields?: Record<string, boolean>;
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  disabled?: boolean;
  onFormSubmitCallback: () => void;
};
