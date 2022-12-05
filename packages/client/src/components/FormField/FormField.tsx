import './FormField.css';

import cn from 'classnames';
import { FC } from 'react';

import { FormFieldProps } from './typings';

export const FormField: FC<FormFieldProps> = ({
  id,
  type,
  value,
  title,
  required,
  placeholder,
  error,
  onChange,
  disabled,
  className,
}) => {
  return (
    // TODO Папку с компонентом FormField перенести в папку Form
    // TODO перенести правила .form-field в .form__field (в компоненте Form)
    <div className={cn('form__field', 'form-field', className)} data-testid="form-field">
      <label className="form-field__label" htmlFor={id}>
        {title}
        {required && <em>*</em>}
      </label>
      <input
        id={id}
        required={required}
        className="input form-field__input"
        type={type || 'text'}
        name={id}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};
