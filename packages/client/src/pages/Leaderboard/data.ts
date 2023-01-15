import { LeaderboardFieldProps } from './LeaderboardField/typings';

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
