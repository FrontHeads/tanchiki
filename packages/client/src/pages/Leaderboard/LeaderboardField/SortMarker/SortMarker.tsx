import './SortMarker.css';

import { FC } from 'react';

import { SortMarkerProps } from './typings';

export const SortMarker: FC<SortMarkerProps> = ({ sortDirection }) => {
  return <div className="sort-marker">{sortDirection === 'desc' ? '▾' : '▴'}</div>;
};
