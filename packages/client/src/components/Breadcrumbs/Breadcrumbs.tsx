import './Breadcrumbs.css';

import cn from 'classnames';
import { type FC } from 'react';
import { useMatches } from 'react-router-dom';

import { type HandledMatch } from '../../app.typings';
import { BreadcrumbsVariant } from './data';
import { type BreadcrumbsProps } from './typings';

const hasCrumbHandler = (match: Record<string, unknown>): match is HandledMatch => {
  return (
    match.handle !== null &&
    typeof match.handle === 'object' &&
    'crumb' in match.handle &&
    typeof match.handle.crumb === 'function'
  );
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ variant }) => {
  const matches = useMatches();

  const crumbs = matches.filter(hasCrumbHandler).map(match => match.handle.crumb(match.data));

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
