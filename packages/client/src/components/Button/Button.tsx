import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, className, variant, testId, ...rest }) => {
  const buttonClassNames = cn('button', className, { [`button_${variant}`]: variant });

  return (
    <button {...rest} type={type} className={buttonClassNames} data-testid={testId}>
      {text}
    </button>
  );
  // return <button {...props}>{text}</button>;
};
