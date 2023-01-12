import './SortMarker.css';

import { type FC } from 'react';

import { type SortMarkerProps } from './typings';

export const SortMarker: FC<SortMarkerProps> = ({ sortDirection }) => {
  return <div className={`sort-marker${sortDirection === 'desc' ? '' : ' up'}`}>▾</div>;
};
