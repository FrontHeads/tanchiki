import { type Creator } from './Creator/typings';

export const pageTitle = 'О проекте';
export const crew = 'Команда';

export const Creators: Creator[] = [
  {
    id: 49460860,
    name: 'Дмитрий Назимов',
    partOne: 'kurs-ssu',
    partTwo: 'mail.ru',
    content: `
    <ul class="creator__text_list">
      <li>Тимлид</li>
      <li>Организация процессов, ведение документации</li>
      <li>Дизайн проекта (отрисовка макетов, верстка, темизация, canvas спрайты, анимации)</li>
      <li>Адаптация под мобильные устройства (верстка, управление игрой)</li>
      <li>Загрузка изображений и звуков в игру</li>
      <li>Работа с Web Audio API</li>
      <li>Настройка CI</li>
      <li>Настройка линтинга</li>
    </ul>`,
  },
  {
    id: 1927032,
    name: 'Станислав Сальников',
    partOne: 'delfi89',
    partTwo: 'gmail.com',
    content: `
    <ul class="creator__text_list">
      <li> Реализация SSR в связке с React Router 6</li>
      <li> Интеграция Redux (@Redux<li>Tolikit) + Redux Thunk</li>
      <li> Настройка роутинга</li>
      <li> Подключение Postgres и MongoDB</li>
      <li> Настройка деплоя в облако</li>
      <li> Работа над игровым сценарием</li>
    </ul>`,
  },
  {
    id: 2198393,
    name: 'Алексей Савенков',
    partOne: 'sapomaro',
    partTwo: 'ya.ru',
    content: `
    <ul class="creator__text_list">
      <li> Разработка архитектуры игрового движка без использования сторонних библиотек</li>
      <li> Реализация сложных внутриигровых механик и фич (движение и столкновение объектов на карте)</li>
      <li> Работа с canvas</li>
      <li> Реализовал подсчёт и отправку игровой статистики для лидерборда</li>
      <li> Подключил Service Worker</li>
      <li> Отлов и исправление багов в игре</li>
    </ul>`,
  },
  {
    id: 51950012,
    name: 'Дмитрий Грамотеев',
    partOne: 'gramoteev',
    partTwo: 'gmail.com',
    content: `
    <ul class="creator__text_list">
      <li> Внедрил OAuth авторизацию</li>
      <li> Разработал верстку, роутинг и бекенд форума</li>
      <li> Работа с формами, сложная валидация</li>
      <li> Защита от XSS атак</li>
      <li> Создал множество React компонентов</li>
    </ul>`,
  },
  {
    id: 59737674,
    name: 'Андрей Митрофанов',
    partOne: 'andrei9823',
    partTwo: 'yandex.ru',
    content: `
    <ul class="creator__text_list">
      <li> Добавил в игру Fullscreen Web API</li>
      <li> Внедрил React error boundary</li>
      <li> Реализовал фронтенд часть форума</li>
      <li> Настроил CSP</li>
      <li> Реализовал страницу лидерборда</li>
      <li> Подключил Reselect для мемоизации селекторов</li>
      <li> Создал множество React компонентов</li>
    </ul>`,
  },
];

export const introduction = `
<div class="about__introduction">
  <p>
    Реализация веб-версии культовой игры 80-х и 90-х гг. 
    <a href="https://en.wikipedia.org/wiki/Battle_City">Battle City</a> 
    с использованием Canvas, Typescript, React, Redux, React Router,  Vite.
  </p>
  <p>
    Проект создан в учебных целях в рамках курса 
    <a href="https://practicum.yandex.ru/middle-frontend/">Мидл фронтенд разработчик</a> 
    от Яндекс Практикума.
  </p>
</div>`;
