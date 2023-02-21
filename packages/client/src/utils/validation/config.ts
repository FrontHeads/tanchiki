export const ValidationRegex = {
  LoginCompound: /^[a-zA-Z0-9\-_]+$/i,
  nameCompound: /^[а-яёА-ЯЁa-zA-Z-]+$/i,
  EmailCompound: /^[a-zA-Z0-9\-.@_]+$/i,
  PhoneFormat: /^(\+|\d)[0-9]+$/i,
  EmailFormat: /@\w+\./,
  onlyNumbers: /^[\d]+$/,
  hasClosedTagScript: /<\/script>/i,
  atLeastOneDigit: /\d{1,}/,
  firstLetterIsCapital: /^[A-ZА-ЯЁ]{1}/,
  atLeastOneCapitalChar: /[A-ZА-ЯЁ]{1,}/,
};

export enum ValidationErrorMessage {
  NotEmpty = 'Поле не может быть пустым.',
  ForumTextFormat = 'Поле не может содержать этот текст',
  PhoneLength = 'Длина номера телефона должна быть от 10 до 15 символов.',
  PhoneFormat = 'Телефон может состоять только из цифр и знака + в начале.',
  EmailCompound = 'Email может состоять только из латинских символов, цифр, дефиса, точки и символа @',
  EmailFormat = 'Email должен быть указан в формате yyy@xxx.zz',
  FirstNameCompound = 'Имя может состоять только из русских или латинских букв, а также дефиса.',
  SecondNameCompound = 'Фамилия может состоять только из русских или латинских букв, а также дефиса.',
  NameBegin = 'Первая буква должна быть заглавной',
  PasswordLength = 'Пароль должен быть от 8 до 40 символов.',
  PasswordNum = 'Пароль должен содержать хотя бы одну цифру.',
  PasswordCapitalChar = 'Пароль должен содержать хотя бы одну заглавную букву.',
  LoginLength = 'Логин должен быть от 3 до 20 символов.',
  LoginCompound = 'Логин может состоять только из латинских символов, цифр, знаков дефиса и нижнего подчеркивания.',
  LoginFormat = 'Логин не может состоять только из цифр.',
}
