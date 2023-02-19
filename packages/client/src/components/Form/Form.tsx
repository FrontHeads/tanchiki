import './Form.css';

import { type FC, type FormEvent, useState } from 'react';

import { FormContext } from './FormContext';
import { type FormProps } from './typings';

export const Form: FC<FormProps> = ({ header = '', children, ...rest }) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  const value = {
    isFormSubmitted,
    setIsFormSubmitted,
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
