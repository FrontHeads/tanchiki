const serviceWorker = self as unknown as ServiceWorkerGlobalScope; // чтобы не ругался тайпскрипт

const REPORTING = false;
const CACHE_NAME = 'tanchiki-cache-1';
// Импорты в SW не работают, поэтому список игровых ресурсов нельзя забрать из game/services/Resources
// Теперь игра грузится быстрее
const GAME_ASSETS = [
  '/assets/img/bricks.png',
  '/assets/img/bricks_modern.png',
  '/assets/img/sprite.png',
  '/assets/img/sprite_modern.png',
  '/assets/img/tarmac_background.png',
  '/assets/sounds/level-intro.mp3',
  '/assets/sounds/game-over.mp3',
  '/assets/sounds/pause.mp3',
  '/assets/sounds/tank-move.mp3',
  '/assets/sounds/tank-idle.mp3',
  '/assets/sounds/ice.mp3',
  '/assets/sounds/shoot.mp3',
  '/assets/sounds/hit-enemy.mp3',
  '/assets/sounds/hit-brick.mp3',
  '/assets/sounds/hit-steel.mp3',
  '/assets/sounds/player-explosion.mp3',
  '/assets/sounds/enemy-explosion.mp3',
  '/assets/sounds/powerup-appear.mp3',
  '/assets/sounds/powerup-pickup.mp3',
  '/assets/sounds/life.mp3',
  '/assets/sounds/score.mp3',
];
const PRECACHE_URLS = ['/', '/index.html', '/game', '/about', '/leaderboard', '/profile', ...GAME_ASSETS];
const CACHE_CONTENT_TYPES = ['script', 'style', 'font', 'image', 'audio', 'manifest'];
const FALLBACK_BODY = `
  <h1>Интернеты упали! Но это неточно...</h1>
  <h2>Обнови страницу или вернись на главную</h2>
`;
const FALLBACK_HEADERS = { headers: { 'Content-Type': 'text/html; charset=utf-8' } };

/** Для логирования. */
function logStatus(msg: string, obj?: unknown) {
  if (REPORTING) {
    console.log(msg, obj || null);
  }
}

/** Проверяет нужно ли кешировать запрос. */
function shouldUseCache(req: Request) {
  // Чтобы не проходили запросы типа chrome-extension://
  if (!req.url.match(/^http/)) {
    return false;
  }

  // Запросы к API не кешируются
  if (req.url.indexOf('/api/') !== -1) {
    return false;
  }

  return true;
}

/**
 * Проверяет, нужно ли отдавать кеш сразу или попробовать дождаться ответа из сети.
 * Если запрос к HTML-странице, то лучше получить её актуальную версию
 * (т.к. нам не нужен кеш страницы с устаревшим preloaded_state, сгенерированным SSR)
 * */
function shouldServeCacheInstantly(req: Request) {
  // Проверка на тип контента (upd: некоторые браузеры не считают mp3 за audio)
  if (CACHE_CONTENT_TYPES.includes(req.destination)) {
    return true;
  }

  // Запросы к страницам (upd: некоторые браузеры не относят html к типу document)
  if (req.destination === 'document' || req.url[req.url.length - 1] === '/' || req.url.match(/\/[A-Za-z0-9_-]+$/)) {
    return false;
  }

  return true;
}

// При установке воркера кешируем часть данных (статику)
serviceWorker.addEventListener('install', (event: ExtendableEvent) => {
  logStatus('SW: installing', event);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // `addAll()` собирает и кеширует статику по указанному массиву ссылок
      .then(cache => cache.addAll(PRECACHE_URLS))
      // `skipWaiting()` для активации SW сразу, а не после перезагрузки страницы
      .then(() => {
        serviceWorker.skipWaiting();
        logStatus('SW: cache added & skipped waiting');
      })
  );
});

// Активация происходит только после того, как предыдущая версия SW была удалена из браузера
serviceWorker.addEventListener('activate', (event: ExtendableEvent) => {
  logStatus('SW: activating', event);

  event.waitUntil(
    // `clients.claim()` позволяет SW начать перехватывать запросы с самого начала,
    // это работает вместе с `skipWaiting()` в `install`, позволяя использовать `fallback` с самых первых запросов
    serviceWorker.clients.claim()
  );
});

// Стратегия `stale-while-revalidate` (сначала отдаём кеш, а если есть свежее из сети - обновляем кеш и досылаем)
serviceWorker.addEventListener('fetch', (event: FetchEvent) => {
  if (!shouldUseCache(event.request)) {
    return;
  }

  logStatus('SW: fetching', event.request.url);

  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.match(event.request).then(cachedResponse => {
          // Делаем запрос для обновления кеша с таймаутом 5 секунд
          const controller = new AbortController();
          const abortTimeout = setTimeout(() => controller.abort(), 5000);
          const fetchedResponse = fetch(event.request, { signal: controller.signal })
            .then(networkResponse => {
              clearTimeout(abortTimeout);
              // Кладём ответ в кеш, если он содержит что-то субстантивное
              if (networkResponse.status >= 200 && networkResponse.status < 300) {
                cache.put(event.request, networkResponse.clone()).catch(cacheError => {
                  logStatus('SW: cache put error', cacheError);
                });
              }
              return networkResponse;
            })
            .catch(fetchedError => {
              logStatus('SW: network problem', fetchedError);
              return cachedResponse ?? new Response(FALLBACK_BODY, FALLBACK_HEADERS);
            });

          // Если есть кеш, возвращаем его, не дожидаясь ответа из сети (кроме определённых случаев)
          if (cachedResponse && shouldServeCacheInstantly(event.request)) {
            logStatus('SW: return cached response', event.request.url);
            return cachedResponse;
          }

          // Если нет кеша, ждём и возвращаем ответ из сети
          logStatus('SW: return network response', event.request.url);
          return fetchedResponse;
        })
      )
      .catch(cacheError => {
        logStatus('SW: cache open error', cacheError);
        return new Response(FALLBACK_BODY, FALLBACK_HEADERS);
      })
  );
});

export type {}; // чтобы не ругался тайпскрипт (из-за --isolatedModules)
