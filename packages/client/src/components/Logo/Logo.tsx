import './Logo.css';

import { FC } from 'react';

export const Logo: FC = () => {
  return (
    <div data-testid="logo" className="logo">
      <a className="logo__link" href="/">
        ТАНЧИКИ
      </a>
    </div>
  );
};
