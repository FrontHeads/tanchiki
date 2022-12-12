// import { FieldError } from 'react-hook-form';

export type FormFieldProps = {
  title: string;
  type: string;
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  labelText?: string;
  inputHeader?: string;
  error?: string; //FieldError;
  pattern?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
