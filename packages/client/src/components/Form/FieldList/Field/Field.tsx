import cn from 'classnames';
import { type FC, useMemo, useState } from 'react';

import { ValidationErrors } from '../../../ValidationErrors';
import { type FieldProps } from './typings';

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
  const [isFocused, setIsFocused] = useState(false);

  const fieldId = useMemo(() => `field-${id}`, [id]);

  const fieldClassNames = cn('form__field', className, {
    form__field_active: isFocused,
  });

  return (
    <div className={fieldClassNames} data-testid="form-field" id={fieldId}>
      <label className="form__field-label" htmlFor={id}>
        {title}
        {required ? <em>*</em> : null}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          className="input form__field-input"
          name={id}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          rows={5}
          disabled={disabled}
          value={value}></textarea>
      ) : (
        <input
          id={id}
          className="input form__field-input"
          type={type || 'text'}
          name={id}
          placeholder={placeholder}
          onBlur={e => {
            if (onBlur) {
              onBlur(e);
            }
            setIsFocused(false);
          }}
          onChange={onChange}
          onFocus={() => {
            setIsFocused(true);
          }}
          value={value}
          disabled={disabled}
        />
      )}

      {errorList ? <ValidationErrors errorList={errorList} /> : null}
    </div>
  );
};
