import './Button.css';

import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, onClick, selector, ...rest }) => {
  return (
    <button type={type} onClick={onClick} className={`button ${selector}`} {...rest}>
      {text}
    </button>
  );
};
