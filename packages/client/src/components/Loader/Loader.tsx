import './Loader.css';

import { FC } from 'react';

export const Loader: FC = () => {
  return (
    <div className="loader" data-testid="loader">
      <div className="loader__circle"></div>
      <div className="loader__background"></div>
    </div>
  );
};
