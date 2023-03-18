import './LeaderboardRow.css';

import { type FC } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { type LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { username, score, matches, rate }, place }) => {
  const sortDirection = useAppSelector(leaderboardSelectors.sortDirection);
  const leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;
  const maxNameLengthLimit = window.innerWidth < 500 ? 13 : Infinity;

  return (
    <tr className={leaderboardRowClassName} data-testid="leaderboard-row">
      <td>{place}</td>
      <td>{username.length < maxNameLengthLimit ? username : username.slice(0, 12) + '...'}</td>
      <td>{score}</td>
      <td>{rate}</td>
      <td>{matches}</td>
    </tr>
  );
};
