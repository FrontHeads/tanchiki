export const ValidationRegex = {
  loginCompound: /^[a-zA-Z0-9\-_]+$/i,
  nameCompound: /^[а-яёА-ЯЁa-zA-Z-]+$/i,
  emailCompound: /^[a-zA-Z0-9\-.@]+$/i,
  phoneFormat: /^(\+|\d)[0-9]+$/i,
  emailFormat: /@\w+\./,
  onlyNumbers: /^[\d]+$/,
  atLeastOneDigit: /\d{1,}/,
  firstLetterIsCapital: /^[A-ZА-ЯЁ]{1}/,
  atLeastOneCapitalChar: /[A-ZА-ЯЁ]{1,}/,
};

export enum ValidationErrorMessage {
  notEmpty = 'Поле не может быть пустым.',
  phoneLength = 'Длина номера телефона должна быть от 10 до 15 символов.',
  phoneFormat = 'Телефон может состоять только из цифр и знака + в начале.',
  emailCompound = 'Email может состоять только из латинских символов, цифр, дефиса, точки и символа @',
  emailFormat = 'Email должен быть указан в формате yyy<b>@</b>xxx<b>.</b>zz',
  firstNameCompound = 'Имя может состоять только из русских или латинских букв, а также дефиса.',
  secondNameCompound = 'Фамилия может состоять только из русских или латинских букв, а также дефиса.',
  nameBegin = 'Первая буква должна быть заглавной',
  passwordLength = 'Пароль должен быть от 8 до 40 символов.',
  passwordNum = 'Пароль должен содержать хотя бы одну цифру.',
  passwordCapitalChar = 'Пароль должен содержать хотя бы одну заглавную букву.',
  loginLength = 'Логин должен быть от 3 до 20 символов.',
  loginCompound = 'Логин может состоять только из латинских символов, цифр, знаков дефиса и нижнего подчеркивания.',
  loginFormat = 'Логин не может состоять только из цифр.',
}
