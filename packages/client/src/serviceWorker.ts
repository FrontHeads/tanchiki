const serviceWorker = self as unknown as ServiceWorkerGlobalScope; // чтобы не ругался тайпскрипт

const REPORTING = true;
const CACHE_NAME = 'tanchiki-cache-1';
const PRECACHE_URLS = ['/', '/index.html'];
const CACHE_CONTENT_TYPES = ['document', 'script', 'style', 'font', 'image', 'audio', 'object'];
const FALLBACK_BODY = `
  <h1>Интернеты упали! Но это неточно.</h1>
  <h2>Надо бы обновить страницу...</h2>
`;
const FALLBACK_HEADERS = { headers: { 'Content-Type': 'text/html; charset=utf-8' } };

// При установке воркера кешируем часть данных (статику)
serviceWorker.addEventListener('install', (event: ExtendableEvent) => {
  REPORTING && console.log('SW: installing', event);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // `addAll()` собирает и кеширует статику по указанному массиву ссылок
      .then(cache => cache.addAll(PRECACHE_URLS))
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

// Стратегия `stale-while-revalidate`
serviceWorker.addEventListener('fetch', (event: FetchEvent) => {
  REPORTING && console.log('SW: fetch', event.request.destination, event);

  // Проверка на тип контента
  if (!CACHE_CONTENT_TYPES.includes(event.request.destination)) {
    return;
  }

  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Делаем запрос для обновления кеша
          const fetchedResponse = fetch(event.request)
            .then(networkResponse => {
              // Кладём ответ в кеш, если он содержит что-то субстантивное
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(fetchedError => {
              REPORTING && console.warn('SW: network problem', fetchedError);
              return cachedResponse ?? new Response(FALLBACK_BODY, FALLBACK_HEADERS);
            });

          // Если есть кеш, возвращаем его, не дожидаясь ответа из сети
          if (cachedResponse) {
            REPORTING && console.log('SW: return cached response', event.request.url);
            return cachedResponse;
          }

          // Если нет кеша, ждём и возвращаем ответ из сети
          REPORTING && console.log('SW: return network response', event.request.url);
          return fetchedResponse;
        });
      })
      .catch(cacheError => {
        REPORTING && console.warn('SW: cache error', cacheError);
        return new Response(FALLBACK_BODY, FALLBACK_HEADERS);
      })
  );
});

export type {}; // чтобы не ругался тайпскрипт (из-за --isolatedModules)
