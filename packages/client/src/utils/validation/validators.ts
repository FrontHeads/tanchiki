import { ValidationErrorMessage, ValidationRegex } from './config';
import { type Validators } from './typings';

export const validators: Validators = {
  login(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 3 || value.length > 20) {
      errors.push(ValidationErrorMessage.LoginLength);
    }

    if (!ValidationRegex.LoginCompound.test(value)) {
      errors.push(ValidationErrorMessage.LoginCompound);
    }

    if (ValidationRegex.onlyNumbers.test(value)) {
      errors.push(ValidationErrorMessage.LoginFormat);
    }

    return errors;
  },

  password(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 8 || value.length > 40) {
      errors.push(ValidationErrorMessage.PasswordLength);
    }

    if (!ValidationRegex.atLeastOneDigit.test(value)) {
      errors.push(ValidationErrorMessage.PasswordNum);
    }

    if (!ValidationRegex.atLeastOneCapitalChar.test(value)) {
      errors.push(ValidationErrorMessage.PasswordCapitalChar);
    }

    return errors;
  },

  firstName(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.nameCompound.test(value)) {
      errors.push(ValidationErrorMessage.FirstNameCompound);
    }

    if (!ValidationRegex.firstLetterIsCapital.test(value)) {
      errors.push(ValidationErrorMessage.NameBegin);
    }

    return errors;
  },

  secondName(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.nameCompound.test(value)) {
      errors.push(ValidationErrorMessage.SecondNameCompound);
    }

    if (!ValidationRegex.firstLetterIsCapital.test(value)) {
      errors.push(ValidationErrorMessage.NameBegin);
    }

    return errors;
  },

  email(value: string): string[] {
    const errors: string[] = [];

    if (!ValidationRegex.EmailCompound.test(value)) {
      errors.push(ValidationErrorMessage.EmailCompound);
    }

    // После собаки обязательно точка, а перед точкой обязательно буквы
    if (!ValidationRegex.EmailFormat.test(value)) {
      errors.push(ValidationErrorMessage.EmailFormat);
    }

    return errors;
  },

  phone(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 8 || value.length > 15) {
      errors.push(ValidationErrorMessage.PhoneLength);
    }

    if (!ValidationRegex.PhoneFormat.test(value)) {
      errors.push(ValidationErrorMessage.PhoneFormat);
    }

    return errors;
  },

  NotEmpty(value: string): string[] {
    const errors: string[] = [];

    if (!value.length) {
      errors.push(ValidationErrorMessage.NotEmpty);
    }

    return errors;
  },
};
