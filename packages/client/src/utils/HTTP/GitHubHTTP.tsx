import { GITHUB_API_HOST } from '../../../../server/config/constants';
import { buildPath } from './';
import { HTTPClient } from './httpClient';

enum Method {
  GET = 'GET',
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

type GetOptionsWithoutMethod = Omit<Options, 'method' | 'data'>;

export type GitHubResponseType<T> = {
  data: T;
  status: number;
  headers: Record<string, unknown>;
};

export class GitHubHTTP {
  static get<T>(url: string, options: GetOptionsWithoutMethod = {}): Promise<GitHubResponseType<T>> {
    return this._send(url, { ...options, method: Method.GET });
  }

  private static _send<T>(path: string, options: Options = { method: Method.GET }): Promise<GitHubResponseType<T>> {
    const { method, headers = {}, baseUrl = GITHUB_API_HOST, withCredentials = false, ...rest } = options;

    const url = buildPath(baseUrl, path);

    return HTTPClient.getInstance()
      .httpClient({ headers, method, url, withCredentials, ...rest })
      .then(({ data, status, headers }) => {
        return { data, status, headers: { ...headers } };
      });
  }
}
