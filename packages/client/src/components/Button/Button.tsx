import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps, ButtonVariant } from './typings';

export const Button: FC<ButtonProps> = ({ text, variant, type = 'button', ...props }) => {
  const buttonClassNames = cn('button', {
    button_primary: variant === ButtonVariant.primary,
    button_secondary: variant === ButtonVariant.secondary,
  });

  return (
    <button {...props} type={type} className={buttonClassNames}>
      {text}
    </button>
  );
};
