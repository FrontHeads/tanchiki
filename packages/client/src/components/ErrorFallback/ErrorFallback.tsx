import './ErrorFallback.css';

import { FC } from 'react';

import { ErrorFallbackProps } from './typings';

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="ErrorFallback">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="button button_primary">
        Try again
      </button>
    </div>
  );
};
