import { FieldProps } from '../../components/Form/FieldList/Field/typings';
import { SignInForm } from './typings';

export const signInFieldList: FieldProps[] = [
  {
    title: 'Логин',
    type: 'text',
    id: 'login',
    placeholder: 'ivanIvanov',
    validator: 'login',
    required: true,
  },
  {
    title: 'Пароль',
    type: 'password',
    id: 'password',
    placeholder: 'Латинские буквы и цифры',
    validator: 'password',
    required: true,
  },
];

export const signInFormInitialState: SignInForm = {
  login: '',
  password: '',
};
