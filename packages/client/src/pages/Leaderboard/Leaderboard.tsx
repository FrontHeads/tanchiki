import './Leaderboard.css';

import { type FC, Suspense, useEffect, useRef, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { type GetLeaderboardResponseData } from '../../api/leaderboardAPI';
import { leaderboardSelectors, useAppSelector } from '../../store';
import { type ResponseType } from '../../utils/HTTP';
import { generateMetaTags } from '../../utils/seoUtils';
import { filtersInitialState, headerText, leaderboardFields } from './data';
import { LeaderboardChart } from './LeaderboardChart';
import { LeaderboardField } from './LeaderboardField/LeaderboardField';
import { LeaderboardFilter } from './LeaderboardFilter';
import { type Filters } from './LeaderboardFilter/typings';
import { LeaderboardRow } from './LeaderboardRow';
import { type LeaderboardProps } from './typings';

export const Leaderboard: FC<LeaderboardProps> = ({ header = headerText }) => {
  const sortDirection = useAppSelector(leaderboardSelectors.sortDirection);
  const loaderData = useLoaderData() as { leaderboardData: Promise<ResponseType<GetLeaderboardResponseData>> };
  const leaderboard = useAppSelector(leaderboardSelectors.sortedData);
  const [filters, setFilters] = useState<Filters>(filtersInitialState);
  const isNarrowScreenRef = useRef(true);

  // Обернул в useEffect, т.к. при SSR рендеринге window недоступен
  useEffect(() => {
    isNarrowScreenRef.current = window.innerWidth < 500;
  }, []);

  const leaderboardHeadFields = leaderboardFields.map(({ fieldId, fieldName, title }) => (
    <LeaderboardField key={fieldId} fieldName={fieldName} fieldId={fieldId} title={title} />
  ));

  const leaderboardRows = leaderboard.map(({ data }, index) => {
    if (!data.username.toLowerCase().includes(filters.username)) {
      return;
    }
    if (data.score < filters.score.min || data.score > filters.score.max) {
      return;
    }
    if (data.rate < filters.rate.min || data.rate > filters.rate.max) {
      return;
    }
    if (data.matches < filters.match.min || data.matches > filters.match.max) {
      return;
    }

    return (
      <LeaderboardRow
        key={data.username}
        data={data}
        place={sortDirection === 'desc' ? index + 1 : leaderboard.length - index}
        isNarrowScreen={() => isNarrowScreenRef.current}
      />
    );
  });

  return (
    <>
      {generateMetaTags({ title: header })}
      <section className="leaderboard__wrapper">
        <h1 data-testid="lb-header" className="no-margin-top leaderboard__header">
          {header}
        </h1>
        <LeaderboardFilter setFilters={setFilters} />
        <LeaderboardChart filteredData={leaderboardRows} />
        <Suspense
          fallback={
            <span data-testid="leaderboard-table-loader" className="leaderboard__table-loader">
              Загрузка данных...
            </span>
          }>
          <Await resolve={loaderData.leaderboardData}>
            <table border={1} className="leaderboard">
              <thead className="leaderboard__row-header">
                <tr>{leaderboardHeadFields}</tr>
              </thead>
              <tbody>{leaderboardRows}</tbody>
            </table>
          </Await>
        </Suspense>
      </section>
    </>
  );
};
