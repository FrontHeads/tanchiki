import './LeaderboardField.css';

import { FC } from 'react';

import { leaderboardActions, leaderboardSelectors, useAppDispatch, useAppSelector } from '../../../store';
import { SortOption } from '../typings';
import { SortMarker } from './SortMarker/SortMarker';
import { LeaderboardFieldProps } from './typings';

export const LeaderboardField: FC<LeaderboardFieldProps> = ({ fieldName, fieldId, title }) => {
  const { sortOption, sortDirection } = useAppSelector(leaderboardSelectors.all);
  const dispatch = useAppDispatch();

  const handleSort = ({ fieldId }: { fieldId: SortOption }) => {
    if (fieldId !== 'place') {
      dispatch(leaderboardActions.setSortParams({ sortOption: fieldId }));
    }
  };

  return (
    <th onClick={() => handleSort({ fieldId })} className="leaderboard__cell-header" title={title}>
      {fieldName}
      {fieldId === sortOption ? <SortMarker sortDirection={sortDirection} /> : ''}
    </th>
  );
};
