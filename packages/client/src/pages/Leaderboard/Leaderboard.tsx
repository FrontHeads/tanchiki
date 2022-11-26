import './Leaderboard.css';

import { FC } from 'react';
import { DUMMY_LEADERBOARD } from '../../config/constants';
import { RatingRow } from '../../components/RatingRow';

export const Leaderboard: FC = () => {
  return (
    <main>
      <h1 className="no-margin-top">Рейтинг игроков</h1>
      <table className="rating">
        <thead className="rating__row-header">
          <th className="rating__cell-header">#</th>
          <th className="rating__cell-header">Пользователь</th>
          <th className="rating__cell-header">
            Рекорд <div className="rating__sort-marker">▾</div>
          </th>
          <th className="rating__cell-header">Время</th>
          <th className="rating__cell-header">Матчи</th>
        </thead>
        {DUMMY_LEADERBOARD.map(row => {
          return (
            <RatingRow
              place={row.place}
              username={row.username}
              record={row.record}
              time={row.time}
              matches={row.matches}
            />
          );
        })}
      </table>
    </main>
  );
};
