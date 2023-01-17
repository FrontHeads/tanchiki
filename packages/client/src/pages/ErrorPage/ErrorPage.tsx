import './ErrorPage.css';

import { type FC } from 'react';
import { useRouteError } from 'react-router-dom';

import { ErrorBody } from '../../components/ErrorBody/ErrorBody';
import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { generateMetaTags } from '../../utils/seoUtils';
import { type ErrorPageProps, type ErrorType } from './typings';

export const ErrorPage: FC<ErrorPageProps> = ({ status, message = 'Что-то пошло не так' }) => {
  let statusCode, messageText;

  if (status) {
    statusCode = status;
    messageText = message;
  } else {
    // eslint-disable-next-line
    const { status, statusText, message: routerErrorMessage } = useRouteError() as ErrorType;
    statusCode = status?.toString();
    messageText = statusText || routerErrorMessage || message;

    if (statusText === 'Not Found') {
      messageText = 'Не туда попали';
    }
  }
  return (
    <>
      {generateMetaTags({ title: `Ошибка ${statusCode}` })}
      <Logo />
      <div className="delimiter" />
      <ErrorBody status={statusCode} message={messageText} />
      <Footer />
    </>
  );
};
