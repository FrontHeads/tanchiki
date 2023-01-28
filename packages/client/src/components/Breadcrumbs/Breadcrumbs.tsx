import './Breadcrumbs.css';

import cn from 'classnames';
import { type FC } from 'react';
import { useMatches } from 'react-router-dom';

import { BreadcrumbsVariant } from './data';
import { type BreadcrumbsProps } from './typings';

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ variant }) => {
  const matches = useMatches();
  //@ts-ignore
  const crumbs = matches.filter(match => Boolean(match.handle?.crumb)).map(match => match.handle.crumb(match.data));

  const breadcrumbsClassNames = cn('breadcrumbs', {
    breadcrumbs_margins_normal: variant === BreadcrumbsVariant.Normal,
    breadcrumbs_margins_wide: variant === BreadcrumbsVariant.Wide,
  });

  return (
    <div className={breadcrumbsClassNames}>
      {crumbs.map((crumb, index) => (
        <span className="breadcrumbs__item" key={index}>
          {crumb}
        </span>
      ))}
    </div>
  );
};
