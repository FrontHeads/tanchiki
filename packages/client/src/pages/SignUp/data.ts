import { FieldProps } from '../../components/Form/FieldList/Field/typings';
import { SignUpForm } from './typings';

export const signUpFieldList: FieldProps[] = [
  {
    title: 'Email',
    type: 'email',
    id: 'email',
    placeholder: 'ivanIvanov@yandex.ru',
    required: true,
  },
  {
    title: 'Логин',
    type: 'text',
    id: 'login',
    placeholder: 'ivanIvanov',
    required: true,
  },
  {
    title: 'Имя',
    type: 'text',
    id: 'first_name',
    placeholder: 'Иван',
    required: false,
  },
  {
    title: 'Фамилия',
    type: 'text',
    id: 'second_name',
    placeholder: 'Иванов',
    required: false,
  },
  {
    title: 'Телефон',
    type: 'tel',
    id: 'phone',
    placeholder: '+7 800 555 35 35',
    required: true,
  },
  {
    title: 'Пароль',
    type: 'password',
    id: 'password',
    placeholder: 'Латинские буквы и цифры',
    required: true,
  },
  {
    title: 'Повторите пароль',
    type: 'password',
    id: 'password_check',
    placeholder: 'Пароли должны совпадать',
    required: true,
  },
];

export const signUpFormInitialState: SignUpForm = {
  login: '',
  password: '',
  password_check: '',
  first_name: '',
  second_name: '',
  email: '',
  phone: '',
};
