import { PropsWithChildren, useCallback } from 'react';

import { FormField } from './FormField';
import { FormFieldListProps } from './typings';

export const FormFieldList = <FormType extends Record<string, string>>({
  formFieldList,
  formData,
  setFormData,
  disabled,
}: PropsWithChildren<FormFieldListProps<FormType>>) => {
  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  return (
    <>
      {formFieldList.map(field => {
        if ('heading' in field) {
          return (
            <h3 key={field.heading} data-testid="form-input-header" className="form__input-header">
              {field.heading}
            </h3>
          );
        }

        return (
          <FormField
            key={field.id}
            {...field}
            disabled={disabled}
            onChange={inputChangeHandler}
            value={formData[field.id]}
          />
        );
      })}
    </>
  );
};
