import { ValidationErrorMessage, ValidationRegex } from './config';
import { Validators } from './typings';

export const validators: Validators = {
  login(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 3 || value.length > 20) {
      errors.push(ValidationErrorMessage.loginLength);
    }

    if (!ValidationRegex.loginCompound.test(value)) {
      errors.push(ValidationErrorMessage.loginCompound);
    }

    if (ValidationRegex.onlyNumbers.test(value)) {
      errors.push(ValidationErrorMessage.loginFormat);
    }

    return errors;
  },

  password(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 8 || value.length > 40) {
      errors.push(ValidationErrorMessage.passwordLength);
    }

    if (!ValidationRegex.atLeastOneDigit.test(value)) {
      errors.push(ValidationErrorMessage.passwordNum);
    }

    if (!ValidationRegex.atLeastOneCapitalChar.test(value)) {
      errors.push(ValidationErrorMessage.passwordCapitalChar);
    }

    return errors;
  },

  firstName(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.nameCompound.test(value)) {
      errors.push(ValidationErrorMessage.firstNameCompound);
    }

    if (!ValidationRegex.firstLetterIsCapital.test(value)) {
      errors.push(ValidationErrorMessage.nameBegin);
    }

    return errors;
  },

  secondName(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.nameCompound.test(value)) {
      errors.push(ValidationErrorMessage.secondNameCompound);
    }

    if (!ValidationRegex.firstLetterIsCapital.test(value)) {
      errors.push(ValidationErrorMessage.nameBegin);
    }

    return errors;
  },

  email(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.emailCompound.test(value)) {
      errors.push(ValidationErrorMessage.emailCompound);
    }

    // После собаки обязательно точка, а перед точкой обязательно буквы
    if (!ValidationRegex.emailFormat.test(value)) {
      errors.push(ValidationErrorMessage.emailFormat);
    }

    return errors;
  },

  phone(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 8 || value.length > 15) {
      errors.push(ValidationErrorMessage.phoneLength);
    }

    if (!ValidationRegex.phoneFormat.test(value)) {
      errors.push(ValidationErrorMessage.phoneFormat);
    }

    return errors;
  },

  notEmpty(value: string): string[] {
    const errors: string[] = [];

    if (!value.length) {
      errors.push(ValidationErrorMessage.notEmpty);
    }

    return errors;
  },
};
