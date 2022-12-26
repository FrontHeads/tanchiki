import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { useValidation, ValidationResponse } from '../../../utils/validation';
import { Field } from './Field';
import { FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  setFile,
  submitRequested,
  fieldList,
  formData,
  setFormData,
  submitHandler,
  validation,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const [validationErrors, setValidationErrors] = useState({} as ValidationResponse);

  useEffect(() => {
    if (submitRequested) {
      const validationResult = validation(formData);

      if (validationResult.hasErrors) {
        setValidationErrors(validationResult);
        return;
      }

      submitHandler();
    }
  }, [submitRequested]);

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
    [formData, validationErrors]
  );

  const inputFocusHandler = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const inputErrors = validation({ [name]: value });
      console.log('validation obj:', inputErrors);

      if (inputErrors) {
        setValidationErrors({ ...validationErrors, ...inputErrors });
      }
    },
    [formData, validationErrors]
  );

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
            errorList={validationErrors[field.id] as string[]}
          />
        );
      })}
    </>
  );
};
