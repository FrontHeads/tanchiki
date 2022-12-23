import { ErrorMessage } from './config';
import { ValidationRules } from './typings';

export const validationRules: ValidationRules = {
  loginRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{3,20}$)/.test(value)) {
      errors.push(ErrorMessage.loginRulesLength);
    }

    if (!/^[a-zA-Z0-9\-_]+$/i.test(value)) {
      errors.push(ErrorMessage.loginRulesCompound);
    }

    if (/^[\d]+$/.test(value)) {
      errors.push(ErrorMessage.loginRulesFormat);
    }

    return errors;
  },

  passwordRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{8,40}$)/.test(value)) {
      errors.push(ErrorMessage.passwordRulesLength);
    }

    if (!/\d{1,}/.test(value)) {
      errors.push(ErrorMessage.passwordRulesNum);
    }

    if (!/[A-ZА-ЯЁ]{1,}/.test(value)) {
      errors.push(ErrorMessage.passwordRulesCapitalChar);
    }

    return errors;
  },

  firstNameRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ErrorMessage.firstNameRulesCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ErrorMessage.nameRulesBegin);
    }

    return errors;
  },

  secondNameRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[а-яёА-ЯЁa-zA-Z-]+$/i.test(value)) {
      errors.push(ErrorMessage.secondNameRulesCompound);
    }

    if (!/^[A-ZА-ЯЁ]{1}/.test(value)) {
      errors.push(ErrorMessage.nameRulesBegin);
    }

    return errors;
  },

  emailRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^[a-zA-Z0-9\-.@]+$/i.test(value)) {
      errors.push(ErrorMessage.emailRulesCompound);
    }

    // После собаки обязательно точка, а перед точкой обязательно буквы
    if (!/@\w+\./.test(value)) {
      errors.push(ErrorMessage.emailRulesFormat);
    }

    return errors;
  },

  phoneRules(value: string): string[] {
    const errors: string[] = [];

    if (!/^(?=.{10,15}$)/.test(value)) {
      errors.push(ErrorMessage.phoneRulesLength);
    }

    if (!/^(\+|\d)[0-9]+$/i.test(value)) {
      errors.push(ErrorMessage.phoneRulesFormat);
    }

    return errors;
  },

  notEmptyRules(value: string): string[] {
    const errors: string[] = [];

    if (!value.length) {
      errors.push(ErrorMessage.notEmptyRules);
    }

    return errors;
  },
};
