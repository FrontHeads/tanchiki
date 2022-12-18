import { Paths } from '../../config/constants';

export const DUMMY_FORUM = [
  { id: 1, name: 'Ivan1990', topicCount: 2400, messages: 100 },
  { id: 2, name: 'Marussia', topicCount: 1900, messages: 81 },
  { id: 3, name: 'Разное', topicCount: 500, messages: 95 },
  { id: 4, name: 'SomeBoy', topicCount: 2400, messages: 81 },
  { id: 5, name: 'PVH', topicCount: 1900, messages: 95 },
];
export const DUMMY_SECTION = [
  { id: 1, name: 'Как побеждать?', messages: 100 },
  { id: 2, name: 'ГСЧ подкручен', messages: 81 },
  { id: 3, name: 'а сколько вы денег слили на донаты?', messages: 95 },
  { id: 4, name: 'SomeBoy', messages: 81 },
  { id: 5, name: 'PVH', messages: 95 },
];

export const DUMMY_TOPIC = [
  {
    id: 1,
    userId: 1,
    username: 'Ivan1990',
    date: Date(),
    content: 'Здесь что-то не так. Нет такого тэга root. Возможно это опечатка от #root',
  },
  {
    id: 2,
    userId: 2,
    username: 'Marussia',
    date: Date(),
    content:
      'Тут как раз меняли с #root на .root в другом PR, т.к. хорошая практика не привязывать стили к id, хоть тут и ' +
      'корневой элемент гарантированно один и уникален.',
  },
  {
    id: 3,
    userId: 3,
    username: 'Me9aTron',
    date: Date(),
    content: 'Но в итоге тут ни то и ни другое а явная ошибка в селекторе. А есть этот другой PR?',
  },
  {
    id: 5,
    userId: 2,
    username: 'Marussia',
    date: Date(),
    content:
      'Тут как раз меняли с #root на .root в другом PR, т.к. хорошая практика не привязывать стили к id, хоть тут и ' +
      'корневой элемент гарантированно один и уникален.',
  },
];

export const DUMMY_SECTION_BREADCRUMBS = [{ href: Paths.Forum, title: 'Forum' }, { title: 'Section' }];

export const DUMMY_TOPIC_BREADCRUMBS = [
  { href: Paths.Forum, title: 'Forum' },
  { href: '#', title: 'Section' },
  { title: 'Как побеждать?' },
];
