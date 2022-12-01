import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps, ButtonVariant } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, variant, testId, ...rest }) => {
  const buttonClassNames = cn('button', {
    button_primary: variant === ButtonVariant.primary,
    button_secondary: variant === ButtonVariant.secondary,
  });

  return (
    <button {...rest} type={type} className={buttonClassNames} data-testid={testId}>
      {text}
    </button>
  );
};
