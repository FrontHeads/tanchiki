import './Form.css';

import cn from 'classnames';
import { FC } from 'react';

import { FormProps } from './typings';

export const Form: FC<FormProps> = ({ handlerSubmit, header = '', children, hasErrors, ...rest }) => {
  const formClassNames = cn('form', {
    'form_has-errors': hasErrors,
  });

  return (
    <form data-testid="form" className={formClassNames} onSubmit={handlerSubmit} {...rest}>
      {header ? <h1 className="form__header">{header}</h1> : null}
      {children}
    </form>
  );
};
