import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { ValidationResponse } from '../../../utils/validation';
import { Field } from './Field';
import { FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  setFile,
  fieldList,
  formData,
  setFormData,
  setFormHasErrors,
  isFormSubmitted,
  validation,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const [validationErrors, setValidationErrors] = useState<ValidationResponse>({});

  useEffect(() => {
    const validationResult = validation(formData);
    console.log('validationResult', !!validationResult.hasErrors, validationResult);
    setFormHasErrors(!!validationResult.hasErrors);
    setValidationErrors(validationErrors);
  }, [isFormSubmitted]);

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, files } = event.target;
      if (setFile && type === 'file' && files?.length) {
        setFile(files[0]);
      }
      setFormData({ ...formData, [name]: value });
    },
    [formData, validationErrors]
  );

  const inputBlurHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      const validationResult = validation(formData);
      console.log('validationResult', validationResult);

      if (validationResult[name]) {
        setValidationErrors({ ...validationErrors, ...{ [name]: validationResult[name] } });
      }

      setFormHasErrors(!!validationResult.hasErrors);
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
            onBlur={inputBlurHandler}
            onChange={inputChangeHandler}
            value={formData[field.id] || ''}
            errorList={validationErrors[field.id] as string[]}
          />
        );
      })}
    </>
  );
};
