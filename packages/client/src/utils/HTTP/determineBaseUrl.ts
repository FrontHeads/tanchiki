import { LOCAL_API_HOST, LOCAL_CLIENT_PORT, YANDEX_API_HOST } from '../../config/constants';

/** Определяет, как клиенту нужно ходить к API Яндекса - через наш сервер или напрямую */
export function determineBaseUrl() {
  if (typeof document !== 'undefined') {
    const { hostname, port } = document.location;
    const isClientPort = port === LOCAL_CLIENT_PORT.toString();

    if (typeof hostname !== 'undefined' && typeof port !== 'undefined') {
      // На клиентской сборке обращаемся к API Яндекса напрямую
      if (isClientPort && ['localhost', '127.0.0.1'].includes(hostname)) {
        return YANDEX_API_HOST;
      }
      // На Github Pages лежит только клиент, поэтому обращаемся к API Яндекса напрямую
      if (hostname === 'frontheads.github.io') {
        return YANDEX_API_HOST;
      }
      // Если в браузерной строке IP вместо localhost, то заменяем, чтобы не было ругани из-за CORS
      if (hostname === '127.0.0.1') {
        return LOCAL_API_HOST.replace('localhost', '127.0.0.1');
      }
    }
  }

  return LOCAL_API_HOST;
}
