import { ValidationErrorMessage } from './config';
import { ValidationRules } from './typings';

export const validationRules: ValidationRules = {
  loginRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{3,20}$)/.test(value)) {
      errors.push(ValidationErrorMessage.loginRulesLength);
    }

    if (!/^[a-zA-Z0-9\-_]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.loginRulesCompound);
    }

    if (/^[\d]+$/.test(value)) {
      errors.push(ValidationErrorMessage.loginRulesFormat);
    }

    return errors;
  },

  passwordRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{8,40}$)/.test(value)) {
      errors.push(ValidationErrorMessage.passwordRulesLength);
    }

    if (!/\d{1,}/.test(value)) {
      errors.push(ValidationErrorMessage.passwordRulesNum);
    }

    if (!/[A-ZА-ЯЁ]{1,}/.test(value)) {
      errors.push(ValidationErrorMessage.passwordRulesCapitalChar);
    }

    return errors;
  },

  firstNameRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.firstNameRulesCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ValidationErrorMessage.nameRulesBegin);
    }

    return errors;
  },

  secondNameRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.secondNameRulesCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ValidationErrorMessage.nameRulesBegin);
    }

    return errors;
  },

  emailRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[a-zA-Z0-9\-.@]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.emailRulesCompound);
    }

    // После собаки обязательно точка, а перед точкой обязательно буквы
    if (!/@\w+\./.test(value)) {
      errors.push(ValidationErrorMessage.emailRulesFormat);
    }

    return errors;
  },

  phoneRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{10,15}$)/.test(value)) {
      errors.push(ValidationErrorMessage.phoneRulesLength);
    }

    if (!/^(\+|\d)[0-9]+$/i.test(value)) {
      errors.push(ValidationErrorMessage.phoneRulesFormat);
    }

    return errors;
  },

  notEmptyRules(value: string): string[] {
    const errors: string[] = [];

    if (!value.length) {
      errors.push(ValidationErrorMessage.notEmptyRules);
    }

    return errors;
  },
};
