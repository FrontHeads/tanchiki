import './LeaderboardRow.css';

import { FC } from 'react';

import { LeaderboardRowType } from './typings';

export const LeaderboardRow: FC<LeaderboardRowType> = ({ row }) => {
  return (
    <tr className="leaderboard__row">
      <td>{row.place}</td>
      <td>{row.username}</td>
      <td>{row.record}</td>
      <td>{row.time}</td>
      <td>{row.matches}</td>
    </tr>
  );
};
