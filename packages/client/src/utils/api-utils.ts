import { APIError } from '../api/typings';

export const apiHasError = (response: Record<string, unknown> | APIError): response is APIError => {
  return typeof response === 'object' && 'reason' in response;
};
