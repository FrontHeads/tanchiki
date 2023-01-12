import { YANDEX_API_HOST } from '../../config/constants';
import { axios, buildPath } from './';

enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

type Options = {
  method: Method;
  data?: Record<string, unknown> | FormData;
  params?: Record<string, unknown>;
  timeout?: number;
  headers?: Record<string, string>;
  baseUrl?: string;
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
    return this._send(url, { ...options, method: Method.Get });
  }

  static put<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send(path, { ...options, method: Method.Put });
  }

  static post<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.Post });
  }

  static patch<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.Patch });
  }

  static delete<T>(path: string, options: OptionsWithoutMethod = {}): Promise<ResponseType<T>> {
    return this._send<T>(path, { ...options, method: Method.Delete });
  }

  private static _send<T>(path: string, options: Options = { method: Method.Get }): Promise<ResponseType<T>> {
    const { method, headers = { 'Content-Type': 'application/json' }, baseUrl = YANDEX_API_HOST, ...rest } = options;

    const url = buildPath(baseUrl, path);

    return axios({ headers, method, url, withCredentials: true, ...rest }).then(({ data, status, headers }) => {
      return { data, status, headers: { ...headers } };
    });
  }
}
