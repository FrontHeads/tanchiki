import { type LoaderFunction } from 'react-router-dom';

import { type AppDispatch } from '../store';
import { leaderboardThunks } from '../store/features/leaderboard/leaderboardThunks';

/**
 * Предзагрузка данных leaderboard
 */
export const leaderboardLoader = (dispatch: AppDispatch): LoaderFunction => {
  return () => {
    const leaderboardData = dispatch(leaderboardThunks.getLeaderboard());
    return { leaderboardData };
  };
};
