import { FormFieldProps } from '../../components/Form/FormFieldList/FormField/typings';
import { SignInForm } from './typings';

export const signInFieldList: FormFieldProps[] = [
  {
    title: 'Логин',
    type: 'text',
    id: 'login',
    placeholder: 'ivanIvanov',
    required: true,
  },
  {
    title: 'Пароль',
    type: 'password',
    id: 'password',
    placeholder: 'Латинские буквы и цифры',
    required: true,
  },
];

export const signInFormInitialState: SignInForm = {
  login: '',
  password: '',
};
