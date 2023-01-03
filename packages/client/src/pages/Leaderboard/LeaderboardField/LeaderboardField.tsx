import './LeaderboardField.css';

import cn from 'classnames';
import { FC, useState } from 'react';

import { fieldNames } from './data';
import { LeaderboardFieldProps } from './typings';

export const LeaderboardField: FC<LeaderboardFieldProps> = ({ fieldName, onClick, sortOption }) => {
  const sortMarkerClassName = cn('leaderboard__sort-marker', {
    'leaderboard__sort-marker_hidden': sortOption !== name,
  });

  const [sortValue, setSortValue] = useState('desc');

  const handleClick = () => {
    if (sortValue === 'desc') {
      setSortValue('asc');
    }
    if (sortValue === 'asc') {
      setSortValue('desc');
    }
    onClick({ fieldName: fieldNames[fieldName], direction: sortValue });
  };

  return (
    <th onClick={handleClick} className="leaderboard__cell-header">
      {fieldName} <div className={sortMarkerClassName}>▾</div>
    </th>
  );
};
