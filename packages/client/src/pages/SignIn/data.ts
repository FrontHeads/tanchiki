import { FormFieldProps } from '../../components/FormField/typings';

export const signInInputFields: FormFieldProps[] = [
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
