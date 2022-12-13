import { PropsWithChildren, useCallback } from 'react';

import { Field } from './Field';
import { FieldListProps } from './typings';

export const FieldList = <T extends Record<string, string>>({
  fieldList,
  formData,
  setFormData,
  disabled,
}: PropsWithChildren<FieldListProps<T>>) => {
  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
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
            value={formData[field.id]}
          />
        );
      })}
    </>
  );
};