import './Button.css';

import cn from 'classnames';
import { type FC } from 'react';

import { ButtonVariant } from './data';
import { type ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ text, variant, type = 'button', ...props }) => {
  const buttonClassNames = cn('button', {
    button_primary: variant === ButtonVariant.Primary,
    button_secondary: variant === ButtonVariant.Secondary,
  });

  return (
    <button {...props} type={type} className={buttonClassNames}>
      {text}
    </button>
  );
};
