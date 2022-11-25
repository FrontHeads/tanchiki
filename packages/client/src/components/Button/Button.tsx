import './Button.css';

import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = (
  {
    type = 'button',
    text,
    onClick,
    mod
  }) => {
    return (
      <button type={type} onClick={onClick} className={`button button_${mod}`}>{text}</button>
    );
};
