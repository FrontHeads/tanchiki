import { FC } from 'react';

import { LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({ place, username, record, time, matches }) => {
  return (
    <tr className="leaderboard__row">
      <td>{place}</td>
      <td>{username}</td>
      <td>{record}</td>
      <td>{time}</td>
      <td>{matches}</td>
    </tr>
  );
};
