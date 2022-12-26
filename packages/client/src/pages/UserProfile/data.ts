import { FormInputAndHeadingList } from '../../app.typings';

export const userProfileFieldList: FormInputAndHeadingList = [
  {
    title: 'Email',
    type: 'email',
    id: 'email',
    validator: 'email',
    placeholder: 'ivan@mail.ru',
    required: true,
  },
  {
    title: 'Логин',
    type: 'text',
    id: 'login',
    validator: 'login',
    placeholder: 'Логин',
    required: true,
  },
  {
    title: 'Имя',
    type: 'text',
    id: 'first_name',
    validator: 'firstName',
    placeholder: 'Имя',
  },
  {
    title: 'Фамилия',
    type: 'text',
    id: 'second_name',
    validator: 'secondName',
    placeholder: 'Фамилия',
  },
  {
    title: 'Имя в чате',
    type: 'text',
    id: 'display_name',
    validator: 'firstName',
    placeholder: 'Имя в чате',
  },
  {
    title: 'Телефон',
    type: 'tel',
    id: 'phone',
    validator: 'phone',
    placeholder: 'ivanIvanov',
    required: true,
  },
  {
    heading: 'Если хотите поменять пароль:',
  },
  {
    title: 'Текущий пароль',
    type: 'password',
    id: 'oldPassword',
    validator: 'password',
    placeholder: 'Старый пароль',
  },
  {
    title: 'Новый пароль',
    type: 'password',
    id: 'newPassword',
    validator: 'password',
    placeholder: 'Новый пароль',
  },
  {
    heading: 'Если хотите поменять аватар:',
  },
  {
    title: 'Фото',
    type: 'file',
    id: 'avatar',
    validator: 'avatar',
    className: 'form-field_input-padding_lg',
  },
];
