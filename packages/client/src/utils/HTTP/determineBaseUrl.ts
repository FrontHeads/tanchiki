import { LOCAL_API_HOST, YANDEX_API_HOST } from '../../config/constants';

/** Определяет, как клиенту нужно ходить к API Яндекса - через наш сервер или напрямую */
export function determineBaseUrl() {
  if (typeof document !== 'undefined') {
    const { hostname, port } = document.location;

    if (hostname && port) {
      // На клиентской сборке выводим API Яндекса
      if (port === '3000' && ['localhost', '127.0.0.1'].includes(hostname)) {
        return YANDEX_API_HOST;
      }
      // На Github Pages лежит только клиент, поэтому выводим API Яндекса
      if (hostname === 'frontheads.github.io') {
        return YANDEX_API_HOST;
      }
    }
  }

  return LOCAL_API_HOST;
}
