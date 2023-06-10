import { type LeaderboardFieldProps } from './LeaderboardField/typings';
import { type Filters } from './LeaderboardFilter/typings';

export const headerText = 'Рейтинг игроков';

export const leaderboardFields: LeaderboardFieldProps[] = [
  {
    fieldId: 'place',
    fieldName: '#',
    title: 'Место в таблице рейтинга',
  },
  {
    fieldId: 'username',
    fieldName: 'Игрок',
    title: 'Имя игрока',
  },
  {
    fieldId: 'score',
    fieldName: 'Очки ',
    title: 'Рекорд по очкам',
  },
  {
    fieldId: 'rate',
    fieldName: 'Очки/минута',
    title: 'Среднее количество очков за минуту игры',
  },
  {
    fieldId: 'matches',
    fieldName: 'Уровни',
    title: 'Сколько уровней пройдено',
  },
];

export const filtersInitialState = {
  username: '',
  score: { min: 0, max: Infinity },
  rate: { min: 0, max: Infinity },
  match: { min: 0, max: Infinity },
} as Filters;
