import React, { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { type FormInputAndHeading } from '../../../app.typings';
import { useValidation } from '../../../utils/validation';
import { type ValidationErrorList } from '../../../utils/validation/typings';
import { useFormContext } from '../FormContext';
import { Field } from './Field';
import { type FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  setFile,
  fieldList,
  formData,
  setFormData,
  onFormSubmitCallback,
  hidingFields,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const validation = useValidation(fieldList);
  const listRef = useRef<HTMLDivElement>(null);
  const { isFormValidating, setIsFormValidating } = useFormContext();
  const isHidden = (field: FormInputAndHeading) => hidingFields && field.id in hidingFields && hidingFields[field.id];

  const scrollToFirstInvalidField = () => {
    if (listRef.current) {
      const firstInvalidField = listRef.current.querySelector('.validation-errors');

      if (!firstInvalidField) {
        return;
      }

      firstInvalidField.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  useEffect(() => {
    if (isFormValidating) {
      const validationResponse = validation(formData);

      if (validationResponse.hasErrors) {
        setValidationErrors(validationResponse.errors);
      } else {
        onFormSubmitCallback();
      }
      setIsFormValidating(false);
    }

    // Если есть ошибки валидации - прокручиваем к первому невалидному полю
    if (Object.keys(validationErrors).length) {
      scrollToFirstInvalidField();
    }
  }, [isFormValidating]);

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value, type } = event.target;
      if (setFile && type === 'file' && 'files' in event.target && event.target.files?.length) {
        setFile(event.target.files[0]);
      }
      setFormData(oldState => ({ ...oldState, [name]: value }));

      const validationResponse = validation({ [name]: value });

      setValidationErrors(oldState => ({ ...oldState, ...validationResponse.errors }));
    },
    []
  );

  const inputBlurHandler = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    const validationResponse = validation({ [name]: value });

    if (!isFormValidating) {
      setValidationErrors(oldState => ({ ...oldState, ...validationResponse.errors }));
    }
  }, []);

  return (
    <div className="form__fields" ref={listRef}>
      {fieldList.map(field => {
        if (isHidden(field)) {
          return null;
        }
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
            errorList={validationErrors[field.id]}
          />
        );
      })}
    </div>
  );
};
