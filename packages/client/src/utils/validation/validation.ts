import { FormInputAndHeadingList } from '../../app.typings';
import { FieldProps } from '../../components/Form/FieldList/Field/typings';
import { ValidationResponse } from './typings';
import { validators } from './validators';

export function useValidation(formInputAndHeadingList: FormInputAndHeadingList) {
  const fieldList = formInputAndHeadingList.filter((value): value is FieldProps => 'id' in value);

  return (inputs: Record<string, string>, isSubmitValidation = false) => {
    const validationResponse = { hasErrors: false } as ValidationResponse;

    Object.entries(inputs).forEach(([id, value]) => {
      const field = fieldList.find(field => field.id === id);

      if (field?.validator) {
        // Пропускаем проверку не обязательных полей в момент отправки формы
        if (isSubmitValidation && !field.required && value === '') {
          return;
        }

        const result = validators[field.validator](value);
        if (result.length) {
          validationResponse.hasErrors = true;
        }
        validationResponse[id] = result;
      }
    });

    return validationResponse;
  };
}
