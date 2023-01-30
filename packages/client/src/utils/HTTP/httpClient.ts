import axios, { AxiosError } from 'axios';

import { type APIError } from '../../api/typings';
import { apiHasError } from '../apiUtils';

const httpClient = axios.create();

// Check if error response body contains reason of error
httpClient.interceptors.response.use(
  response => response,
  (error: AxiosError<Record<string, unknown> | APIError>): Promise<AxiosError> => {
    if (error instanceof AxiosError && error.response && apiHasError(error.response.data)) {
      return Promise.reject(new Error(error.response.data.reason));
    }

    return Promise.reject(error);
  }
);

export { httpClient };
