import './Leaderboard.css';

import { FC } from 'react';

import { leaderboardAPI } from '../../api/leaderboardAPI';
import { useAppDispatch } from '../../store';
import { leaderboardThunks } from '../../store/features/leaderboard/leaderboardThunks';
import { DUMMY_LEADERBOARD } from './DummyData';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardProps } from './typings';

export const headerText = 'Рейтинг игроков';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const dispatch = useAppDispatch();

  dispatch(
    leaderboardThunks.addScore({
      // data: {
      username: 'yatx',
      score: 11,
      matches: 1,
      // },
      ratingFieldName: 'string',
      teamName: 'string',
    })
  );
  dispatch(
    leaderboardThunks.getAll({
      ratingFieldName: 'string',
      cursor: 10,
      limit: 10,
    })
  );

  return (
    <section className="leaderboard__wrapper">
      <h1 className="no-margin-top leaderboard__header">{header}</h1>
      <table border={1} className="leaderboard">
        <thead className="leaderboard__row-header">
          <tr>
            <th className="leaderboard__cell-header">#</th>
            <th className="leaderboard__cell-header">Пользователь</th>
            <th className="leaderboard__cell-header">
              Рекорд <div className="leaderboard__sort-marker">▾</div>
            </th>
            <th className="leaderboard__cell-header">Время</th>
            <th className="leaderboard__cell-header">Матчи</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_LEADERBOARD.map(row => {
            return <LeaderboardRow key={row.place} row={row} />;
          })}
        </tbody>
      </table>
    </section>
  );
};
