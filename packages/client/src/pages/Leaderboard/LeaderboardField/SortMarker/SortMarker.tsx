import './SortMarker.css';

import { FC } from 'react';

import { SortMarkerProps } from './typings';

//**Здесь не знаю как исправить ТС ошибку */
//@ts-ignore
export const SortMarker: FC<SortMarkerProps> = ({ sortDirection }) => {
  if (sortDirection === 'desc') return <div className="sort-marker">▼</div>;
  if (sortDirection === 'asc') return <div className="sort-marker">▲</div>;
};
