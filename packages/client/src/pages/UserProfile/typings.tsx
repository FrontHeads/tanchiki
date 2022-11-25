export type UserProfileForm = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
};

export type InputProps = {
  title: string;
  type: string;
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  inputHeader?: string;
  errorRefName?: string;
  pattern?: string;
  error?: string;
  events?: Record<string, unknown>;
};

export type UserProfile = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
};

export const baseInputFields: InputProps[] = [
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
];

export const passwordInputFields: InputProps[] = [
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
];
