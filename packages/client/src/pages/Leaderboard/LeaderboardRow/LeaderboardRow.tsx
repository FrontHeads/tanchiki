import './LeaderboardRow.css';

import { type FC } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { type LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { username, score, matches, rate }, place }) => {
  const sortDirection = useAppSelector(leaderboardSelectors.sortDirection);
  const leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;

  return (
    <tr className={leaderboardRowClassName} data-testid="leaderboard-row">
      <td>{place}</td>
      <td>{username}</td>
      <td>{score}</td>
      <td>{rate}</td>
      <td>{matches}</td>
    </tr>
  );
};
