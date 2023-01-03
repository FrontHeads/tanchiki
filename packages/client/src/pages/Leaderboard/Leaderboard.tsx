import './Leaderboard.css';

import { FC, useEffect } from 'react';

import { Loader } from '../../components/Loader';
import {
  leaderboardActions,
  leaderboardSelectors,
  leaderboardThunks,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { fieldNames } from './LeaderboardField/data';
import { LeaderboardField } from './LeaderboardField/LeaderboardField';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardProps } from './typings';

export const headerText = 'Рейтинг игроков';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const dispatch = useAppDispatch();

  const { isLoading, leaderboard } = useAppSelector(leaderboardSelectors.all);
  console.log(leaderboard);

  const handleSort = ({ fieldName, direction }: { fieldName: string; direction: string }) => {
    console.log(fieldName, direction);
    dispatch(leaderboardActions.sortLeaderboard({ fieldName, direction }));
  };

  //**Так добавлять новый рекорд */
  // useEffect(() => {
  //   dispatch(
  //     leaderboardThunks.addScore({
  //       data: {
  //         place: 4,
  //         username: 'ivan',
  //         score: 201,
  //         time: 4000,
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="leaderboard__wrapper">
      <h1 className="no-margin-top leaderboard__header">{header}</h1>
      <table border={1} className="leaderboard">
        <thead className="leaderboard__row-header">
          <tr>
            {Object.keys(fieldNames).map(fieldName => (
              <LeaderboardField key={fieldName} fieldName={fieldName} onClick={handleSort} />
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
