import { FC, useCallback, useState } from 'react';

import { FormField } from '../../FormField';
import { FormFieldListProps } from './typings';

export const FormFieldList: FC<FormFieldListProps> = ({ formFieldList, formData }) => {
  const [requestBody, setRequestBody] = useState(formData);

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const { name, value } = event.target;
      setRequestBody({ ...requestBody, [name]: value });
    },
    [requestBody]
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

        return <FormField key={field.id} {...field} onChange={inputChangeHandler} value={requestBody[field.id]} />;
      })}
    </>
  );
};
