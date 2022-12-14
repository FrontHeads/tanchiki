import cn from 'classnames';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ValidationErrorList } from '../../../utils/validation/typings';
import { Field } from './Field';
import { FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  setFile,
  fieldList,
  formData,
  setFormData,
  onFormSubmitCallback,
  setIsFormSubmitted,
  isFormSubmitted,
  validation,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const [formHasErrors, setFormHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const formClassNames = cn('form', {
    'form_has-errors': formHasErrors,
  });

  useEffect(() => {
    if (isFormSubmitted) {
      const validationResponse = validation(formData);

      setFormHasErrors(validationResponse.hasErrors);

      if (validationResponse.hasErrors) {
        setValidationErrors(validationResponse.errors);
        toast.error('Поля заполнены некорректно');
      } else {
        onFormSubmitCallback();
      }
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  const inputChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
    if (setFile && type === 'file' && files?.length) {
      setFile(files[0]);
    }
    setFormData(oldState => ({ ...oldState, [name]: value }));

    const validationResponse = validation({ [name]: value });

    setValidationErrors(oldState => ({ ...oldState, ...validationResponse.errors }));
  }, []);

  const inputBlurHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const validationResponse = validation({ [name]: value });

    if (!isFormSubmitted) {
      setValidationErrors(oldState => ({ ...oldState, ...validationResponse.errors }));
    }
  }, []);

  return (
    <div className={formClassNames}>
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
            errorList={validationErrors[field.id]}
          />
        );
      })}
    </div>
  );
};
