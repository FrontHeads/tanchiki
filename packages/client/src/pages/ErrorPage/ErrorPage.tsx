import './ErrorPage.css';

import { FC } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Paths } from '../../config/constants';
import { Root } from '../../layouts/Root';
import { ErrorType } from './typings';

export const ErrorPage: FC = () => {
  const error = useRouteError() as ErrorType;
  const navigate = useNavigate();

  let messageText = error.statusText || error.message || 'Возникла ошибка';

  if (error.statusText === 'Not Found') {
    messageText = 'Не туда попали';
  }

  return (
    <Root>
      <div className="web-error">
        <h1 className="web-error__paragraph web-error__header" data-testid="web-error__header">
          {error.status}
        </h1>
        <p className="web-error__paragraph web-error__msg">{messageText}</p>

        <p className="web-error__paragraph web-error__link">
          <Button
            testId="web-error__button"
            text="На главную"
            onClick={() => navigate(Paths.Home)}
            variant={ButtonVariant.secondary}
          />
        </p>
      </div>
    </Root>
  );
};
