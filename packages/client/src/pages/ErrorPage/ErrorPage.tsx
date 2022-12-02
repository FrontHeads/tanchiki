import './ErrorPage.css';

import { FC } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Paths } from '../../config/constants';
import { Root } from '../../layouts/Root';
import { ErrorPageProps, ErrorType } from './typings';

export const ErrorPage: FC<ErrorPageProps> = ({ status, message = 'Возникла ошибка' }) => {
  const navigate = useNavigate();
  let statusCode, messageText;

  if (status) {
    statusCode = status;
    messageText = message;
  } else {
    const { status, statusText, message: routerErrorMessage } = useRouteError() as ErrorType;
    statusCode = status;
    messageText = statusText || routerErrorMessage || message;

    if (statusText === 'Not Found') {
      messageText = 'Не туда попали';
    }
  }

  return (
    <Root>
      <div className="web-error">
        <h1 className="web-error__paragraph web-error__header" data-testid="web-error__header">
          {statusCode}
        </h1>
        <p className="web-error__paragraph web-error__msg">{messageText}</p>

        <p className="web-error__paragraph web-error__link">
          <Button
            data-testid="web-error__button"
            text="На главную"
            onClick={() => navigate(Paths.Home)}
            variant={ButtonVariant.Secondary}
          />
        </p>
      </div>
    </Root>
  );
};
