import './Leaderboard.css';

import { type FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { type GetLeaderboardResponseData } from '../../api/leaderboardAPI';
import { leaderboardSelectors, useAppSelector } from '../../store';
import { type ResponseType } from '../../utils/HTTP';
import { generateMetaTags } from '../../utils/seoUtils';
import { leaderboardFields } from './data';
import { LeaderboardField } from './LeaderboardField/LeaderboardField';
import { LeaderboardRow } from './LeaderboardRow';
import { type LeaderboardProps } from './typings';

export const headerText = 'Рейтинг игроков';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const sortDirection = useAppSelector(leaderboardSelectors.sortDirection);
  const loaderData = useLoaderData() as { leaderboardData: Promise<ResponseType<GetLeaderboardResponseData>> };
  const leaderboard = useAppSelector(leaderboardSelectors.sortedData);

  return (
    <>
      {generateMetaTags({ title: header })}
      <section className="leaderboard__wrapper">
        <h1 data-testid="lb-header" className="no-margin-top leaderboard__header">
          {header}
        </h1>
        <Suspense fallback={<span data-testid="leaderboard-table-loader">Загрузка данных...</span>}>
          <Await resolve={loaderData.leaderboardData}>
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
                {leaderboard.map((row, index) => (
                  <LeaderboardRow
                    key={row.data.username}
                    data={row.data}
                    place={sortDirection === 'desc' ? index + 1 : leaderboard.length - index}
                  />
                ))}
              </tbody>
            </table>
          </Await>
        </Suspense>
      </section>
    </>
  );
};
