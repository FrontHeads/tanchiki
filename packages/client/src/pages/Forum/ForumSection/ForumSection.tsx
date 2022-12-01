import './ForumSection.css';

import { FC } from 'react';

import { ForumSectionProps } from './typings';

export const ForumSection: FC<ForumSectionProps> = ({ name }) => {
  return (
    <section className="leaderboard__wrapper">
      <h1 className="no-margin-top">{name}</h1>
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
            return <ForumTopic key={row.place} row={row} />;
          })}
        </tbody>
      </table>
    </section>
  );
};
