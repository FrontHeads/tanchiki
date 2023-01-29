import { Route } from 'react-router-dom';

import { leaderboardAPI } from '../api/leaderboardAPI';
import { Leaderboard } from '../pages/Leaderboard';
import {
  LEADERBOARD_DEFAULT_PAGE,
  LEADERBOARD_RECORDS_DISPLAY_LIMIT,
  LEADERBOARD_SORT_FIELD,
  Paths,
} from './constants';

/**
 * Предзагрузка данных leaderboard
 */
export const leaderboardLoader = () => {
  const leaderboardData = leaderboardAPI.getLeaderboard({
    ratingFieldName: LEADERBOARD_SORT_FIELD,
    cursor: LEADERBOARD_DEFAULT_PAGE,
    limit: LEADERBOARD_RECORDS_DISPLAY_LIMIT,
  });
  return { leaderboardData };
};

export const leaderboardRoute = () => {
  return <Route path={Paths.Leaderboard} element={<Leaderboard />} loader={leaderboardLoader}></Route>;
};
