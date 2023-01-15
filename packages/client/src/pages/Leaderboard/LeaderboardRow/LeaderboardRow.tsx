import './LeaderboardRow.css';

import { FC } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> =
  ({ data: { username, score, matches, rate }, place }) => {
    const { sortDirection } = useAppSelector(leaderboardSelectors.all);

    const leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;

    return (
      <tr className={leaderboardRowClassName}>
        <td>{place}</td>
        <td>{username}</td>
        <td>{score}</td>
        <td>{rate}</td>
        <td>{matches}</td>
      </tr>
    );
  };
