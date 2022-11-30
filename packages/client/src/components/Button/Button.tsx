import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, onClick, className, variant }) => {
  const buttonClassNames = cn('button', className, { [`button_${variant}`]: variant });
  return (
    <button type={type} onClick={onClick} className={buttonClassNames}>
      {text}
    </button>
  );
};
