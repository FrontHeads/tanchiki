import './Breadcrumbs.css';

import cn from 'classnames';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { BreadcrumbsVariant } from './data';
import { type BreadcrumbsProps } from './typings';

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ data, variant }) => {
  const breadcrumbsClassNames = cn('breadcrumbs', {
    breadcrumbs_margins_normal: variant === BreadcrumbsVariant.Normal,
    breadcrumbs_margins_wide: variant === BreadcrumbsVariant.Wide,
  });

  return (
    <div className={breadcrumbsClassNames}>
      {data.map((item, index) => (
        <div key={index} className="breadcrumbs__item">
          {item.href ? <Link to={item.href}>{item.title}</Link> : <span>{item.title}</span>}
        </div>
      ))}
    </div>
  );
};
