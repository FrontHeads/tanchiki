import './Button.css';

import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, onClick, selector }) => {
  return (
    <button type={type} onClick={onClick} className={`button ${selector}`}>
      {text}
    </button>
  );
};
