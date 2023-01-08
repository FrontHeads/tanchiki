import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { renderWithRouter } from '../../utils/testingUtils';
import { headerText, Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  test('it renders', async () => {
    await act(async () => {
      renderWithRouter({ component: <Leaderboard header={headerText} /> });
    });
    expect(screen.getByText(headerText)).toBeInTheDocument();
  });
});
