export type FieldProps = {
  title: string;
  type: string;
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  labelText?: string;
  inputHeader?: string;
  errorList?: string[];
  pattern?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
