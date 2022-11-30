import './Button.css';

import cn from 'classnames';
import { FC } from 'react';

import { ButtonProps } from './typings';

export const Button: FC<ButtonProps> = ({ type = 'button', text, onClick, className, variant, testId }) => {
  const buttonClassNames = cn('button', className, { [`button_${variant}`]: variant });

  const props: Record<string, string> = {};

  if (testId) {
    props['data-testid'] = testId;
  }

  return (
    <button type={type} {...props} onClick={onClick} className={buttonClassNames}>
      {text}
    </button>
  );
};
