import { buildPath, determineAPIHost } from './';
import { HTTPClient } from './httpClient';

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type Options = {
  method: Method;
  data?: Record<string, unknown> | FormData | string;
  params?: Record<string, unknown>;
  timeout?: number;
  headers?: Record<string, string>;
  baseUrl?: string;
  withCredentials?: boolean;
};

type OptionsWithoutMethod = Omit<Options, 'method' | 'params'>;
type GetOptionsWithoutMethod = Omit<Options, 'method' | 'data'>;

export type ResponseType<T> = {
  data: T;
  status: number;
  headers: Record<string, unknown>;
};

export class HTTP {
  static get<T>(url: string, options: GetOptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send(url, { ...options, method: Method.GET });
  }

  static put<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send(path, { ...options, method: Method.PUT });
  }

  static post<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.POST });
  }

  static patch<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.PATCH });
  }

  static delete<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.DELETE });
  }

  private static _send<T>(path: string, options: Options = { method: Method.GET }): Promise<ResponseType<T>> {
    const {
      method,
      headers = { 'Content-Type': 'application/json' },
      baseUrl = determineAPIHost(),
      withCredentials = true,
      ...rest
    } = options;

    const url = buildPath(baseUrl, path);

    return HTTPClient.getInstance()
      .httpClient({ headers, method, url, withCredentials, ...rest })
      .then(({ data, status, headers }) => {
        return { data, status, headers: { ...headers } };
      });
  }
}
