import './LeaderboardRow.css';

import { FC, useMemo } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { convertMsToTime } from '../../../utils/dateUtils';
import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { username, score, time, matches }, place }) => {
  const { sortOption, sortDirection } = useAppSelector(leaderboardSelectors.all);
  const convertedTime = useMemo(() => convertMsToTime(time), [time]);

  let leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;

  //Сортировка по месту: 1 место > 2 > 3. Поэтому меняем направление подсветки
  if (sortOption === 'place') {
    leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_asc' : '_desc'}`;
  }

  return (
    <tr className={leaderboardRowClassName}>
      <td>{place}</td>
      <td>{username}</td>
      <td>{score}</td>
      <td>{convertedTime}</td>
      <td>{matches}</td>
    </tr>
  );
};
