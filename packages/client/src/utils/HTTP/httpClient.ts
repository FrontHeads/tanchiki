import axios, { AxiosError } from 'axios';

import { APIError } from '../../api/typings';
import { apiHasError } from '../apiUtils';

// Check if error response body contains reason of error
axios.interceptors.response.use(
  response => response,
  (error: AxiosError<Record<string, unknown> | APIError>): Promise<AxiosError> => {
    if (error instanceof AxiosError && error.response && apiHasError(error.response.data)) {
      return Promise.reject(new Error(error.response.data.reason));
    }

    return Promise.reject(error);
  }
);

export { axios };
