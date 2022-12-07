import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import { Game } from './Game';

describe('Game page', () => {
  test('it renders', () => {
    render(<Game />);

    expect(document.querySelector('.game__root')).not.toBe(null);
  });
});
