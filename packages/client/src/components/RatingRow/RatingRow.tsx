import { FC } from 'react';

import { RatingRowProps } from './typings';

export const RatingRow: FC<RatingRowProps> = ({ place, username, record, time, matches }) => {
  return (
    <tr className="rating__row">
      <td>{place}</td>
      <td>{username}</td>
      <td>{record}</td>
      <td>{time}</td>
      <td>{matches}</td>
    </tr>
  );
};
