import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Paths } from '../../config/constants';
import { Button } from '../Button';
import { ButtonVariant } from '../Button/typings';
import { ErrorBodyProps } from './typings';

export const ErrorBody: FC<ErrorBodyProps> = ({ status, message, isRefresh = false }) => {
  const navigate = useNavigate();

  return (
    <div className="web-error">
      <h1 className="web-error__paragraph web-error__header" data-testid="web-error__header">
        {status}
      </h1>
      <p className="web-error__paragraph web-error__msg">{message}</p>

      <p className="web-error__paragraph web-error__link">
        <Button
          data-testid="web-error__button"
          text={isRefresh ? 'Обновить' : 'На главную'}
          onClick={() => {
            if (isRefresh) {
              navigate(0);
            } else {
              navigate(Paths.Home);
            }
          }}
          variant={ButtonVariant.Secondary}
        />
      </p>
    </div>
  );
};
