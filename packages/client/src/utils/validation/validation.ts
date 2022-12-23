import { ValidationRulesConfig } from './config';
import { ValidationResponse, ValidationRulesName } from './typings';
import { validationRules } from './validationRules';

export function validation(inputs: Record<string, string>, nonRequiredFields?: string[]) {
  const validationResponse: ValidationResponse = { hasErrors: false };

  Object.entries(inputs).forEach(([name, value]) => {
    const rulesName = ValidationRulesConfig[name as ValidationRulesName];
    if (rulesName) {
      if (nonRequiredFields && nonRequiredFields.includes(name) && value === '') {
        return;
      }

      const result = validationRules[rulesName](value);
      if (result.length) {
        validationResponse.hasErrors = true;
      }
      validationResponse[name] = result;
    }
  });

  return validationResponse;
}
