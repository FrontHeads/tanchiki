import './Leaderboard.css';

import { FC, useEffect } from 'react';

import { Loader } from '../../components/Loader';
import { leaderboardSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { leaderboardFields } from './data';
import { LeaderboardField } from './LeaderboardField/LeaderboardField';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardProps } from './typings';

export const headerText = 'Рейтинг игроков';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(leaderboardSelectors.all);
  const leaderboard = useAppSelector(leaderboardSelectors.sortedData);

  //**Так добавлять новый рекорд */
  // useEffect(() => {
  //   dispatch(
  //     leaderboardThunks.addScore({
  //       data: {
  //         place: 1,
  //         username: 'yatx',
  //         score: 6003,
  //         time: 121234,
  //         matches: 34,
  //       },
  //       ratingFieldName: 'score',
  //       teamName: 'FrontHeadsTest',
  //     })
  //   );
  // }, []);

  useEffect(() => {
    dispatch(
      leaderboardThunks.getLeaderboard({
        // TODO: заменить название поля на константное
        ratingFieldName: 'score',
        cursor: 0,
        limit: 10,
      })
    );
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="leaderboard__wrapper">
      <h1 className="no-margin-top leaderboard__header">{header}</h1>
      <table border={1} className="leaderboard">
        <thead className="leaderboard__row-header">
          <tr>
            {leaderboardFields.map(field => (
              <LeaderboardField key={field.fieldId} fieldName={field.fieldName} fieldId={field.fieldId} />
            ))}
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(row => {
            /**TODO: Убрать ?? row.data.username */
            return <LeaderboardRow key={row.data.place ?? row.data.username} data={row.data} />;
          })}
        </tbody>
      </table>
    </section>
  );
};
