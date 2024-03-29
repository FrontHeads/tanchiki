import './Logo.css';

import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../../config/constants';

export const Logo: FC = () => {
  return (
    <div className="logo__wrapper">
      <div data-testid="logo" className="logo">
        <Link to={Paths.Home} className="logo__link">
          ТАНЧИКИ
        </Link>
      </div>
    </div>
  );
};
