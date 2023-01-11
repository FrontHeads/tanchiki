import './LeaderboardRow.css';

import { FC, useMemo } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { convertMsToTime } from '../../../utils/dateUtils';
import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { place, username, score, time, matches } }) => {
  const { sortOption, sortDirection } = useAppSelector(leaderboardSelectors.all);
  const convertedTime = useMemo(() => convertMsToTime(time), [time]);

  let leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;

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
