const serviceWorker = self as unknown as ServiceWorkerGlobalScope;  // чтобы не ругался тайпскрипт

const REPORTING = true;
const CACHE_NAME = 'tanchiki-cache-1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
];
const CACHE_CONTENT_TYPES = ['document', 'script', 'style', 'font', 'image', 'audio', 'object'];

// При установке воркера кешируем часть данных (статику)
serviceWorker.addEventListener('install', (event: ExtendableEvent) => {
  REPORTING && console.log('SW: installing', event);

  event.waitUntil(
    caches.open(CACHE_NAME)
      // `addAll()` собирает и кеширует статику по указанному массиву ссылок
      .then((cache) => cache.addAll(PRECACHE_URLS))
      // `skipWaiting()` для активации SW сразу, а не после перезагрузки страницы
      .then(() => { 
        serviceWorker.skipWaiting();
        REPORTING && console.log('SW: cache added & skipped waiting');
      })
  );
});

// Активация происходит только после того, как предыдущая версия SW была удалена из браузера
serviceWorker.addEventListener('activate', (event: ExtendableEvent) => {
  REPORTING && console.log('SW: activating', event);

  event.waitUntil(
    // `clients.claim()` позволяет SW начать перехватывать запросы с самого начала,
    // это работает вместе с `skipWaiting()` в `install`, позволяя использовать `fallback` с самых первых запросов
    serviceWorker.clients.claim()
  );
});

// Стратегия `cache first, falling back to network`
serviceWorker.addEventListener('fetch', async (event: FetchEvent) => {
  REPORTING && console.log('SW: fetch', event.request.destination, event);

  // Проверка на тип контента
  if (!CACHE_CONTENT_TYPES.includes(event.request.destination)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request.url)
          .then(cachedResponse => {
            // Сначала проверяем в кеше
            if (cachedResponse) {
              REPORTING && console.log('SW: return cached response', event.request.url);
              return cachedResponse;
            }

            // Если нет в кеше, делаем запрос через сеть
            return fetch(event.request)
              .then((fetchedResponse) => {
                REPORTING && console.log('SW: return network response', event.request.url);

                // Кладём ответ в кеш, если он не частичный (206)
                if (fetchedResponse.status !== 206) {
                  cache.put(event.request, fetchedResponse.clone());
                }
                return fetchedResponse;
              })
              .catch((fetchedError) => {
                REPORTING && console.warn('SW: network problem', fetchedError);
                return new Response();
              })
          })
      })
      .catch((cacheError) => {
        REPORTING && console.warn('SW: cache error', cacheError);
        return new Response();
      })
  );
});

export type {}; // чтобы не ругался тайпскрипт (из-за --isolatedModules)
