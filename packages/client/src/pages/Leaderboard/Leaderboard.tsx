import './Leaderboard.css';

import { FC } from 'react';

import { LeaderboardRow } from '../../components/LeaderboardRow';
import { DUMMY_LEADERBOARD } from './DummyData';

export const Leaderboard: FC = () => {
  return (
    <section className="leaderboard__wrapper">
      <h1 className="no-margin-top">Рейтинг игроков</h1>
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
            return (
              <LeaderboardRow
                key={row.place}
                place={row.place}
                username={row.username}
                record={row.record}
                time={row.time}
                matches={row.matches}
              />
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
