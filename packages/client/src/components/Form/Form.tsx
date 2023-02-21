import './Form.css';

import { type FC, type FormEvent, useState } from 'react';

import { FormContext } from './FormContext';
import { type FormProps } from './typings';

export const Form: FC<FormProps> = ({ header = '', children, ...rest }) => {
  const [isFormValidating, setIsFormValidating] = useState(false);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsFormValidating(true);
  };

  const value = {
    isFormValidating,
    setIsFormValidating,
  };

  return (
    <FormContext.Provider value={value}>
      <form data-testid="form" className="form" onSubmit={submitHandler} {...rest}>
        {header ? <h1 className="form__header">{header}</h1> : null}
        {children}
      </form>
    </FormContext.Provider>
  );
};
