import { ErrorType } from '../../pages/ErrorPage/typings';

export type ErrorFallbackProps = {
  error: ErrorType;
  resetErrorBoundary: () => void;
};
