// Задаем правила валидации в зависимости от имени поля
export enum ValidationRulesConfig {
  login = 'checkLogin',
  password = 'checkPassword',
  oldPassword = 'checkPassword',
  newPassword = 'checkPassword',
  password_check = 'checkPassword',
  first_name = 'checkFirstName',
  display_name = 'checkFirstName',
  second_name = 'checkSecondName',
  email = 'checkEmail',
  phone = 'checkPhone',
  message = 'checkNotEmpty',
  title = 'checkNotEmpty',
}

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
