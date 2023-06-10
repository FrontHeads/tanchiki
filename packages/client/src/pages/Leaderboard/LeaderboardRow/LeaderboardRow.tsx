import './LeaderboardRow.css';

import { type FC, useEffect, useState } from 'react';

import { leaderboardSelectors, useAppSelector } from '../../../store';
import { type LeaderboardRowProps } from './typings';

export const LeaderboardRow: FC<LeaderboardRowProps> = ({
  data: { username, score, matches, rate },
  place,
  isNarrowScreen,
}) => {
  const sortDirection = useAppSelector(leaderboardSelectors.sortDirection);
  const leaderboardRowClassName = `leaderboard__row${sortDirection == 'desc' ? '_desc' : '_asc'}`;
  const [maxNameLengthLimit, setMaxNameLengthLimit] = useState(13);

  // Обернул в useEffect, т.к. иначе возникает ошибка гидратации: Text content does not match server-rendered HTML.
  useEffect(() => {
    setMaxNameLengthLimit(isNarrowScreen() ? 13 : Infinity);
  }, []);

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
