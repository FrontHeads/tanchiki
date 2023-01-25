import { type FieldProps } from '../../components/Form/FieldList/Field/typings';
import { type ContactUsForm } from './typings';

export const contactUsFieldList: FieldProps[] = [
  {
    title: 'Ваше имя',
    type: 'text',
    id: 'name',
  },
  {
    title: 'Ваш email',
    type: 'email',
    id: 'email',
    placeholder: 'example@example.com',
    validator: 'email',
    required: true,
  },
  {
    title: 'Сообщение',
    type: 'textarea',
    id: 'message',
    validator: 'NotEmpty',
    required: true,
  },
];

export const contactUsFormInitialState: ContactUsForm = {
  name: '',
  email: '',
  message: '',
};
