import './Leaderboard.css';

import { FC, useEffect } from 'react';

import { Loader } from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../store';
import { leaderboardSelectors } from '../../store/features/leaderboard/leaderboardSlice';
import { leaderboardThunks } from '../../store/features/leaderboard/leaderboardThunks';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardProps } from './typings';

export const headerText = 'Рейтинг игроков';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const dispatch = useAppDispatch();

  const { isLoading, leaderboard } = useAppSelector(leaderboardSelectors.all);

  //**Так добавлять новый рекорд */
  // useEffect(() => {
  //   dispatch(
  //     leaderboardThunks.addScore({
  //       data: {
  //         place: 3,
  //         username: 'mamajkeeeeee',
  //         score: 201,
  //         time: 50,
  //         matches: 33,
  //       },
  //       ratingFieldName: 'score',
  //       teamName: 'FrontHeadsTest',
  //     })
  //   );
  // }, []);

  useEffect(() => {
    dispatch(
      leaderboardThunks.getLeaderboard({
        ratingFieldName: 'score',
        cursor: 0,
        limit: 10,
      })
    );
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
              {leaderboard.map(row => {
                //@ts-ignore
                return <LeaderboardRow key={row.data.place} row={row.data} />;
              })}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};
