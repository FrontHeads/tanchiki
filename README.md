<div style="text-align:center;">

# ТАНЧИКИ

<!-- https://shields.io/ -->

![lerna](https://img.shields.io/badge/lerna-5.4.3-blue)
![vite](https://img.shields.io/badge/vite-3.0.7-blue)
![typescript](https://img.shields.io/badge/typescript-4.8.2-blue)
![authors](https://img.shields.io/badge/authors-FrontHeads-blueviolet)

</div>

Реализация веб-версии культовой игры 80-х и 90-х гг. [_Battle City_](https://en.wikipedia.org/wiki/Battle_City) с использованием `Canvas`, `Typescript` и `React`

Проект создан в учебных целях в рамках курса [Мидл фронтенд разработчик](https://practicum.yandex.ru/middle-frontend/) от Яндекс Практикума

---

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
- Server Side Rendering
- OAuth
- Nginx
- Yandex Cloud
- Web Workers

## Реализованный функционал

- Страница с игрой
- Создание профиля
- Форум
- Рейтинг игроков
- Возможность смены темы оформления
- Возможность играть без доступа в интернет

## Режим разработки

```
$ yarn bootstrap

$ yarn dev
```

Дополнительные команды:

- `yarn lint` - проверка типов и линтинг всего проекта
- `yarn test` - запустить тесты

## Механика игры

В игре 35 уровней. Задача игрока защитить свою базу от вражеских танков. Для прохождения уровня необходимо уничтожить 20 вражеских танков. Игрок может подбирать различные бонусы (заморозку, щит, дополнительную жизнь и др.)

Каждый уровень содержит различные виды препятствий:

- кирпичные стены: могут быть разрушены танком игрока или врага
- стальные стены: могут быть разрушены, если игрок подберёт улучшение
- вода: блокирует передвижение, но не стрельбу
- деревья: скрывают из виду танк игрока и вражеские танки
- лёд: добавляет инерцию танкам
