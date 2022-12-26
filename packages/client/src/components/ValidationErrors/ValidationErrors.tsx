import './ValidationErrors.css';

import cn from 'classnames';
import { FC } from 'react';

import { ValidationErrorsProps } from './typings';

export const ValidationErrors: FC<ValidationErrorsProps> = ({ errorList, className }) => {
  if (!errorList || errorList.length === 0) {
    return <></>;
  }
  const validationErrorsClassName = cn('validation-errors', className);

  return (
    <ul className={validationErrorsClassName}>
      {errorList.map((error, index) => (
        <li className="validation-errors__item" key={index}>
          {error}
        </li>
      ))}
    </ul>
  );
};
