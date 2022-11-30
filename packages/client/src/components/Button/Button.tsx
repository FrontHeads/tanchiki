import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, onClick, className, testId, variant }) => {
  const buttonClassNames = cn('button', className, { [`button_${variant}`]: variant });

  const props: Record<string, unknown> = {
    onClick: onClick,
    type: type,
    className: buttonClassNames,
  };

  if (testId) {
    props['data-testid'] = testId;
  }

  return <button {...props}>{text}</button>;
};
