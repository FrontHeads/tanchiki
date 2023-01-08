import '@testing-library/jest-dom';

import { act, screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Leaderboard } from './Leaderboard';
describe('Leaderboard', () => {
  test('it renders', () => {
    const headerText = 'Рейтинг игроков';
    act(() => {
      renderWithRouter({ component: <Leaderboard header={headerText} /> });

      const renderedLeaderboard = screen.getByText(headerText);

      expect(renderedLeaderboard).toBeInTheDocument();
    });
  });
});
