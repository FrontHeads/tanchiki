import cn from 'classnames';
import { FC } from 'react';

import { ValidationErrors } from '../../../ValidationErrors';
import { FieldProps } from './typings';

export const Field: FC<FieldProps> = ({
  id,
  type,
  value,
  title,
  required,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled,
  className,
  errorList,
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
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        disabled={disabled}
      />
      {errorList ? <ValidationErrors errorList={errorList} /> : null}
    </div>
  );
};
