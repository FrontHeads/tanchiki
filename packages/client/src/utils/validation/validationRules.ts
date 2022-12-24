import { ValidationErrorMessage } from './config';
import { ValidationRules } from './typings';

export const validationRules: ValidationRules = {
  checkLogin(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{3,20}$)/.test(value)) {
      errors.push(ValidationErrorMessage.loginLength);
    }

    if (!/^[a-zA-Z0-9\-_]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.loginCompound);
    }

    if (/^[\d]+$/.test(value)) {
      errors.push(ValidationErrorMessage.loginFormat);
    }

    return errors;
  },

  checkPassword(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{8,40}$)/.test(value)) {
      errors.push(ValidationErrorMessage.passwordLength);
    }

    if (!/\d{1,}/.test(value)) {
      errors.push(ValidationErrorMessage.passwordNum);
    }

    if (!/[A-ZА-ЯЁ]{1,}/.test(value)) {
      errors.push(ValidationErrorMessage.passwordCapitalChar);
    }

    return errors;
  },

  checkFirstName(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.firstNameCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ValidationErrorMessage.nameBegin);
    }

    return errors;
  },

  checkSecondName(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.secondNameCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ValidationErrorMessage.nameBegin);
    }

    return errors;
  },

  checkEmail(value: string): string[] {
    const errors: string[] = [];

    if (!/^[a-zA-Z0-9\-.@]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.emailCompound);
    }

    // После собаки обязательно точка, а перед точкой обязательно буквы
    if (!/@\w+\./.test(value)) {
      errors.push(ValidationErrorMessage.emailFormat);
    }

    return errors;
  },

  checkPhone(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{10,15}$)/.test(value)) {
      errors.push(ValidationErrorMessage.phoneLength);
    }

    if (!/^(\+|\d)[0-9]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.phoneFormat);
    }

    return errors;
  },

  checkNotEmpty(value: string): string[] {
    const errors: string[] = [];

    if (!value.length) {
      errors.push(ValidationErrorMessage.notEmpty);
    }

    return errors;
  },
};
