import './LeaderboardRow.css';

import cn from 'classnames';
import { FC } from 'react';

import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { place, username, score, time, matches } }) => {
  const LeaderboardRowClassName = cn('leaderboard__row', {
    'first-place': place === 1,
    'second-place': place === 2,
    'third-place': place === 3,
  });

  return (
    <tr className={LeaderboardRowClassName}>
      <td>{place}</td>
      <td>{username}</td>
      <td>{score}</td>
      <td>{time}</td>
      <td>{matches}</td>
    </tr>
  );
};
