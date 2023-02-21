export type FieldProps = {
  title: string;
  type: string;
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  validator?: string;
  labelText?: string;
  inputHeader?: string;
  errorList?: string[] | null;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  pattern?: string;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
