import './LeaderboardRow.css';

import cn from 'classnames';
import { FC, useMemo } from 'react';

import { convertMsToTime } from '../../../utils/dateUtils';
import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { place, username, score, time, matches } }) => {
  const LeaderboardRowClassName = cn('leaderboard__row', {
    'first-place': place === 1,
    'second-place': place === 2,
    'third-place': place === 3,
  });

  const convertedTime = useMemo(() => convertMsToTime(time), [time]);

  return (
    <tr className={LeaderboardRowClassName}>
      <td>{place}</td>
      <td>{username}</td>
      <td>{score}</td>
      <td>{convertedTime}</td>
      <td>{matches}</td>
    </tr>
  );
};
