import './Form.css';

import { FC } from 'react';

import { FormProps } from './typings';

export const Form: FC<FormProps> = ({ handlerSubmit, header = '', children, ...rest }) => {
  return (
    <form data-testid="form" className="form" onSubmit={handlerSubmit} {...rest}>
      {header ? <h1 className="form__header">{header}</h1> : null}
      {children}
    </form>
  );
};
