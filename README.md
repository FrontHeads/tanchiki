<div align='center'>

# ТАНЧИКИ

<!-- https://shields.io/ -->

![lerna](https://img.shields.io/badge/lerna-5.4.3-blue)
![vite](https://img.shields.io/badge/vite-3.0.7-blue)
![typescript](https://img.shields.io/badge/typescript-4.8.2-blue)
![authors](https://img.shields.io/badge/authors-FrontHeads-blueviolet)

</div>

Реализация веб-версии культовой игры 80-х и 90-х гг. [**Battle City**](https://en.wikipedia.org/wiki/Battle_City) с использованием `Canvas`, `Typescript` и `React`

Проект создан в учебных целях в рамках курса [Мидл фронтенд разработчик](https://practicum.yandex.ru/middle-frontend/) от Яндекс Практикума

---

## Демо проекта

- https://frontheads.github.io/

## Документация проекта

- https://github.com/FrontHeads/tanchiki/tree/develop/docs

## Технологии

В проекте используются:

- React
- React Router
- Redux
- Redux Thunk
- Typescript
- Canvas API
- NodeJS
- Postcss
- Axios
- Vite
- Jest
- Server Side Rendering (SSR)
- OAuth
- Nginx
- Yandex Cloud
- Web Workers
- Docker
- Docker-Compose
- NodeJS 19+
- GitHub Actions

## Используемые Web API

- `Canvas API` - реализация движка игры.
- `Performance API` - оптимизация игрового движка.
- `Web Audio API` - работа со звуком в игре.
- `Document API: hidden` - приостановка игры в случае, если вкладка браузера становится неактивной.
- `Fullscreen API` - разворачивание игры на полный экран.
- `Service Worker` - работа приложения в offline.
- `Cache API` - кеширование файлов приложения для работы в offline.
- `LocalStorage API` - хранение данных о выбранной пользователем теме визуального оформления сайта.

## Реализованный функционал

- Страница с игрой.
- Создание профиля.
- Форум.
- Рейтинг игроков.
- Возможность смены темы оформления.
- Возможность играть без доступа в интернет.

## Механика игры

В игре 35 уровней. Задача игрока защитить свою базу от вражеских танков. Для прохождения уровня необходимо уничтожить 20 вражеских танков. Игрок может подбирать различные бонусы (заморозку, щит, дополнительную жизнь и др.)

Каждый уровень содержит различные виды препятствий:

- кирпичные стены: могут быть разрушены танком игрока или врага.
- стальные стены: могут быть разрушены, если игрок подберёт улучшение.
- вода: блокирует передвижение, но не стрельбу.
- деревья: скрывают из виду танк игрока и вражеские танки.
- лёд: добавляет инерцию танкам.

## Docker

Контейнеры, доступные проекте:

- База данных Postgres
- База данных MongoDB
- Серверное приложение с SSR. Сконфигурирована сборка приложения для последующего формирования image и загрузки в репозиторий
- Nginx-proxy
- Acme-companion (для генерации SSL)
- pgAdmin
- mongo-express

## SSR

Проект использует технологию SSR (Server Side Rendering), что позволяет при рендере страницы на стороне сервера генерировать разметку приложения.
Данный подход используется для SEO оптимизации приложений.

## Запуск проекта

Все команды выполняются из корня проекта.

Команды запускают SPA сборку на `3000` порту и серверную (SSR) сборку на `5000` порту.

### Первичная настройка

`yarn bootstrap`

### Режим разработки

`yarn dev`

### Production сервер

`yarn preview` - команда выполняет сборку проекта и запускает express сервер

### Сборка production

`yarn build` - команда выполняет сборку проекта в нужном порядке для корректной работы SSR

### Linters

`yarn lint` - проверка типов, стилей всего проекта (eslint, stylelint)

### Тесты

`yarn test` - запуск тестов

### Форматирование кода

`yarn format` - форматирование с помощью prettier.
Данная команда автоматически запускается перед commit изменений в git

### Docker

Конфигурация разбита на 3 файл:
`docker-compose.yml` - базовая конфигурация. Postgre DB, Mongo db контейнеры

`docker-compose.dev.yml` - конфигурация для работы в dev режиме. PGAdmin, Mongo-express контейнеры

`docker-compose.prod.yml` - конфигурация для работы в production режиме. Express сервер с приложением, Nginx, Acme-companion (для генерации SSL)


#### Команды:

При первом запуске, возможно, понадобится добавить сеть, выполнив следующую команду:
`docker network create tanchiki_default`

`yarn docker` - production сборка и запуск приложения

`yarn docker:up` - запуск production приложения без сборки

`yarn docker:build` - сборка production приложения

`yarn docker:dev` - запуск dev сборки с hot reload при изменениях в коде

`yarn docker:stop` - остановка всех docker контейнеров



## Deploy проекта

Для деплоя используются GitHub Actions

Перед деплоем необходимо заполнить следующие secrets:

`DEPLOY_ENV` - содержимое .env файла

`DEPLOY_HOST` - ip/хост удаленного сервера

`DEPLOY_USER` - имя пользователя удаленного сервера

`DEPLOY_PRIVATE_KEY` - приватный ключ для подключения к удаленному серверу

Deploy происходит автоматически при обновлении main ветки
