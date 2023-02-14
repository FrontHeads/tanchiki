import { CLIENT_ONLY_HOSTS, LOCAL_SERVER_PORT, YANDEX_API_HOST } from '../../config/constants';

/** Определяет, как клиенту нужно ходить к API Яндекса - через наш сервер или напрямую */
export function determineAPIHost() {
  const API_HOST = __API_HOST__ ? `${__API_HOST__}/api` : `http://localhost:${LOCAL_SERVER_PORT}/api`;

  if (typeof document !== 'undefined') {
    const { host, hostname } = document.location;

    // На локальной клиентской сборке обращаемся к API Яндекса напрямую
    if (host && CLIENT_ONLY_HOSTS.includes(host)) {
      return YANDEX_API_HOST;
    }

    // Если в браузерной строке IP вместо localhost, то заменяем, чтобы не было ругани из-за CORS
    if (hostname && hostname === '127.0.0.1') {
      return API_HOST.replace('localhost', '127.0.0.1');
    }
  }

  return API_HOST;
}
