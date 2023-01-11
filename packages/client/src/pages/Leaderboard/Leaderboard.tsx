import './Leaderboard.css';

import { FC, useEffect } from 'react';

import { Loader } from '../../components/Loader';
import { DEFAULT_SORT } from '../../config/constants';
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

  useEffect(() => {
    dispatch(
      leaderboardThunks.getLeaderboard({
        ratingFieldName: DEFAULT_SORT,
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
      <h1 data-testid="lb-header" className="no-margin-top leaderboard__header">
        {header}
      </h1>
      <table border={1} className="leaderboard">
        <thead className="leaderboard__row-header">
          <tr>
            {leaderboardFields.map(field => (
              <LeaderboardField
                key={field.fieldId}
                fieldName={field.fieldName}
                fieldId={field.fieldId}
                title={field.title}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(row => {
            return <LeaderboardRow key={row.data.place} data={row.data} />;
          })}
        </tbody>
      </table>
    </section>
  );
};
