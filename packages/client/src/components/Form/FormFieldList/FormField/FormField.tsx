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
    <div className={cn('form__field', className)} data-testid="form-field">
      <label className="form__field-label" htmlFor={id}>
        {title}
        {required ? <em>*</em> : null}
      </label>
      <input
        id={id}
        required={required}
        className="input form__field-input"
        type={type || 'text'}
        name={id}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
      {error && <div className="form__field-error">{error}</div>}
    </div>
  );
};
