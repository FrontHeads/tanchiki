import { PropsWithChildren, useCallback } from 'react';

import { validation } from '../../../utils/validation';
import { Field } from './Field';
import { FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  setFile,
  fieldList,
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, files } = event.target;
      if (setFile && type === 'file' && files?.length) {
        setFile(files[0]);
      }
      setFormData({ ...formData, [name]: value });

      const inputErrors = validation({ [name]: value });

      if (inputErrors) {
        setValidationErrors({ ...validationErrors, ...inputErrors });
      }
    },
    [formData]
  );

  const inputFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const inputErrors = validation({ [name]: value });

    if (inputErrors) {
      setValidationErrors({ ...validationErrors, ...inputErrors });
    }
  };

  return (
    <>
      {fieldList.map(field => {
        if ('heading' in field) {
          return (
            <h3 key={field.heading} data-testid="form-input-header" className="form__input-header">
              {field.heading}
            </h3>
          );
        }

        return (
          <Field
            key={field.id}
            {...field}
            disabled={disabled}
            onChange={inputChangeHandler}
            onFocus={inputFocusHandler}
            value={formData[field.id] || ''}
            validationErrors={validationErrors[field.id] as string[]}
          />
        );
      })}
    </>
  );
};
