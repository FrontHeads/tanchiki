import './Form.css';

import { FC } from 'react';

import { FormProps } from './typings';

export const Form: FC<FormProps> = ({ handlerSubmit, header = '', children }) => {
  return (
    <form data-testid="form" className="form" onSubmit={handlerSubmit}>
      {header && <h1 className="form__header">{header}</h1>}
      {children}
    </form>
  );
};