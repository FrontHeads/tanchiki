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
  className,
}) => {
  return (
    <div className={cn('form__field', 'form-field', `form__field_id_${id}`, className)} data-testid="form-field">
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
      />
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};
