import './LeaderboardRow.css';

import { FC } from 'react';

import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ data: { place, username, score, time, matches } }) => {
  return (
    <tr className="leaderboard__row">
      <td>{place}</td>
      <td>{username}</td>
      <td>{score}</td>
      <td>{time}</td>
      <td>{matches}</td>
    </tr>
  );
};
