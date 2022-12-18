import { FormInputAndHeadingList } from '../../app.typings';

export const userProfileFieldList: FormInputAndHeadingList = [
  {
    title: 'Email',
    type: 'email',
    id: 'email',
    placeholder: 'ivan@mail.ru',
    required: true,
  },
  {
    title: 'Логин',
    type: 'text',
    id: 'login',
    placeholder: 'Логин',
    required: true,
  },
  {
    title: 'Имя',
    type: 'text',
    id: 'first_name',
    placeholder: 'Имя',
  },
  {
    title: 'Фамилия',
    type: 'text',
    id: 'second_name',
    placeholder: 'Фамилия',
  },
  {
    title: 'Имя в чате',
    type: 'text',
    id: 'display_name',
    placeholder: 'Имя в чате',
  },
  {
    title: 'Телефон',
    type: 'tel',
    id: 'phone',
    placeholder: 'ivanIvanov',
  },
  {
    heading: 'Если хотите поменять пароль:',
  },
  {
    title: 'Текущий пароль',
    type: 'password',
    id: 'oldPassword',
    placeholder: 'Старый пароль',
  },
  {
    title: 'Новый пароль',
    type: 'password',
    id: 'newPassword',
    placeholder: 'Новый пароль',
  },
  {
    heading: 'Если хотите поменять аватар:',
  },
  {
    title: 'Фото',
    type: 'file',
    id: 'avatar',
    className: 'form-field_input-padding_lg',
  },
];
