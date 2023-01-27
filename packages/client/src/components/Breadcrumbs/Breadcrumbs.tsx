import './Breadcrumbs.css';

import { type FC } from 'react';
import { useMatches } from 'react-router-dom';

import { type BreadcrumbsProps } from './typings';

export const Breadcrumbs: FC<BreadcrumbsProps> = () => {
  const matches = useMatches();
  //@ts-ignore 
  const crumbs = matches.filter(match => Boolean(match.handle?.crumb)).map(match => match.handle.crumb(match.data));

  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span className="crumb" key={index}>
          {crumb}
        </span>
      ))}
    </div>
  );
};
