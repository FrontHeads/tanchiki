import './Loader.css';

import { FC } from 'react';

import { LoaderProps } from './typings';

export const Loader: FC<LoaderProps> = props => {
  const testId = props['data-testid'] || 'loader';

  return (
    <div className="loader" {...props} data-testid={testId}>
      <div className="loader__circle"></div>
      <div className="loader__background"></div>
    </div>
  );
};
