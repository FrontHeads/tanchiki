// Задаем правила валидации в зависимости от имени поля
export enum ValidationRulesConfig {
  login = 'loginRules',
  password = 'passwordRules',
  oldPassword = 'passwordRules',
  newPassword = 'passwordRules',
  password_check = 'passwordRules',
  first_name = 'firstNameRules',
  display_name = 'firstNameRules',
  second_name = 'secondNameRules',
  email = 'emailRules',
  phone = 'phoneRules',
  message = 'notEmptyRules',
  title = 'notEmptyRules',
}

export enum ValidationErrorMessage {
  notEmptyRules = 'Поле не может быть пустым.',
  phoneRulesLength = 'Длина номера телефона должна быть от 10 до 15 символов.',
  phoneRulesFormat = 'Телефон может состоять только из цифр и знака + в начале.',
  emailRulesCompound = 'Email может состоять только из латинских символов, цифр, дефиса, точки и символа @',
  emailRulesFormat = 'Email должен быть указан в формате yyy<b>@</b>xxx<b>.</b>zz',
  firstNameRulesCompound = 'Имя может состоять только из русских или латинских букв, а также дефиса.',
  secondNameRulesCompound = 'Фамилия может состоять только из русских или латинских букв, а также дефиса.',
  nameRulesBegin = 'Первая буква должна быть заглавной',
  passwordRulesLength = 'Пароль должен быть от 8 до 40 символов.',
  passwordRulesNum = 'Пароль должен содержать хотя бы одну цифру.',
  passwordRulesCapitalChar = 'Пароль должен содержать хотя бы одну заглавную букву.',
  loginRulesLength = 'Логин должен быть от 3 до 20 символов.',
  loginRulesCompound = 'Логин может состоять только из латинских символов, цифр, знаков дефиса и нижнего подчеркивания.',
  loginRulesFormat = 'Логин не может состоять только из цифр.',
}
