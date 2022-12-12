import { PropsWithChildren, useCallback } from 'react';

import { FormField } from './FormField';
import { FormFieldListProps } from './typings';

export const FormFieldList = <FormType,>({
  formFieldList,
  formData,
  setFormData,
  disabled,
}: PropsWithChildren<FormFieldListProps<FormType>>): JSX.Element => {
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

        const fieldValue = formData[field.id as keyof FormType] as string;
        return (
          <FormField key={field.id} {...field} disabled={disabled} onChange={inputChangeHandler} value={fieldValue} />
        );
      })}
    </>
  );
};
