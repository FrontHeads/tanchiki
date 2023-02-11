import axios, { AxiosError } from 'axios';

import { type APIError } from '../../api/typings';
import { apiHasError } from '../apiUtils';

class HTTPClient {
  private static instance: HTTPClient;
  public httpClient = axios.create();

  private constructor() {
    this.initInterceptors();
  }

  public static getInstance(): HTTPClient {
    if (!HTTPClient.instance) {
      HTTPClient.instance = new HTTPClient();
    }

    return HTTPClient.instance;
  }

  private initInterceptors() {
    /**
     * Забираем request interceptors из глобального инстанса
     * В противном случае interceptors с сервера не подключаются
     * на стороне клиента
     */
    this.httpClient.interceptors.request = axios.interceptors.request;

    // Check if error response body contains reason of error
    this.httpClient.interceptors.response.use(
      response => response,
      (error: AxiosError<Record<string, unknown> | APIError>): Promise<AxiosError> => {
        if (error instanceof AxiosError && error.response && apiHasError(error.response.data)) {
          return Promise.reject(new Error(error.response.data.reason));
        }

        return Promise.reject(error);
      }
    );
  }
}

export { HTTPClient };
