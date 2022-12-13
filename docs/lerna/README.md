### Как запускать?

1. Убедитесь что у вас установлен `node` и `docker`
2. Выполните команду `yarn bootstrap` - это обязательный шаг, без него ничего работать не будет :)
3. Выполните команду `yarn dev`
4. Выполните команду `yarn dev --scope=client` чтобы запустить только клиент
5. Выполните команду `yarn dev --scope=server` чтобы запустить только server

### Как правильно писать коммиты?

Можно почитать в соответствующей разделе [документации](docs/README.md)

### Как добавить зависимости?

В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Флаг `--exact` фиксирует устанавливаемую зависимость.

Чтобы добавить зависимость для клиента
`yarn lerna add {your_dep} --scope client --exact`

Для сервера
`yarn lerna add {your_dep} --scope server --exact`

И для клиента и для сервера
`yarn lerna add {your_dep} --exact`

Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
`yarn lerna add {your_dep} --dev --scope server --exact`

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`yarn test `- запустить все тесты

`yarn test --stream` - запустить все тесты с развернутым отчетом. Показывается какие тесты были запущены, сколько всего было тестов, а также показывается вывод в консоль из тестов.

`yarn test --scope client` - запустить тесты клиентской части приложения. Вывод в консоль работает.

`yarn test --scope server` - запустить тесты серверной части приложения.

`yarn lerna run test:watch --scope client` - запустить тесты в Watch режиме (автоматически перезапускаются при изменении в файлах тестов). Вывод в консоль работает.
Запустить тесты конкретного файла:
Перейти в директорию клиентской части приложения: `cd packages/client`

`yarn jest `<relativePath> - запустить тесты конкретного файла. Например: `yarn jest packages/client/src/components/Form/Form.test.tsx`

### Линтинг

`yarn lint`

### Форматирование prettier

`yarn format`

### Production build

`yarn build`

И чтобы посмотреть что получилось

`yarn preview --scope client`
`yarn preview --scope server`

## Хуки

В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Автодеплой статики на vercel

Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере

Перед первым запуском выполните `node init.js`

`docker compose up` - запустит три сервиса

1. nginx, раздающий клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`
