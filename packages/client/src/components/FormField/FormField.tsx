import './FormField.css';

import { FC } from 'react';

import { InputProps } from './typings';

export const FormField: FC<InputProps> = (
  {
    id,
    type,
    value,
    title,
    required,
    placeholder,
    error,
    onChange
  }) => {
    return (
      <div className="form__field form-field">
        <label className="form-field__label" htmlFor={id}>
          {title}
          {required && <em>*</em>}
        </label>
        <input id={id}
               required={required}
               className="input form-field__input" type={type} name={id} placeholder={placeholder} onChange={onChange} value={value} />
        {error &&
          <div className='form-field__error'>
          </div>
        }
      </div>
    );
};
