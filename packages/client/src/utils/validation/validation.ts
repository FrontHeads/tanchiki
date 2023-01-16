import { useMemo } from 'react';

import { type FormInputAndHeadingList } from '../../app.typings';
import { type FieldProps } from '../../components/Form/FieldList/Field/typings';
import { type ValidationResponse } from './typings';
import { validators } from './validators';

export function useValidation(formInputAndHeadingList: FormInputAndHeadingList) {
  const fieldList = useMemo(
    () => formInputAndHeadingList.filter((value): value is FieldProps => 'id' in value),
    [formInputAndHeadingList]
  );

  return (inputs: Record<string, string>) => {
    const validationResponse: ValidationResponse = { hasErrors: false, errors: {} };

    Object.entries(inputs).forEach(([id, value]) => {
      const field = fieldList.find(field => field.id === id);

      if (field?.validator) {
        if (!field.required && value === '') {
          validationResponse.errors[id] = [];
          return;
        }

        validationResponse.errors[id] = validators[field.validator](value);

        if (validationResponse.errors[id].length && !validationResponse.hasErrors) {
          validationResponse.hasErrors = true;
        }
      }
    });

    return validationResponse;
  };
}
