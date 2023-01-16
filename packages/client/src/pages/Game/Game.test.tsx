import '@testing-library/jest-dom';

import { renderWithRouter } from '../../utils/testingUtils';
import { Game } from './Game';

describe('Game page', () => {
  test('it renders', () => {
    renderWithRouter({ component: <Game /> });

    expect(document.querySelector('.game__root')).not.toBe(null);
  });
});
