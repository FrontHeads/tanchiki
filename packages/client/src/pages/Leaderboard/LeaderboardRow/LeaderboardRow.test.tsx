import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { renderWithRouter } from '../../../utils/testingUtils';
import { LeaderboardRow } from './LeaderboardRow';

describe('LeaderboardRow', () => {
  const place = 1;
  const row = { place: place, username: 'John', score: 1234, time: 2000000, rate: 400, matches: 99 };
  const isNarrowScreen = () => false;

  test('it renders', async () => {
    await act(async () => {
      renderWithRouter({
        component: (
          <table>
            <tbody>
              <LeaderboardRow data={row} place={place} isNarrowScreen={isNarrowScreen} />
            </tbody>
          </table>
        ),
      });
    });

    const renderedElement = screen.getByText(row.username);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', async () => {
    await act(async () => {
      renderWithRouter({
        component: (
          <table>
            <tbody>
              <LeaderboardRow data={row} place={place} isNarrowScreen={isNarrowScreen} />
            </tbody>
          </table>
        ),
      });
    });

    expect(screen.getByText(place)).toBeInTheDocument();
    expect(screen.getByText(row.username)).toBeInTheDocument();
    expect(screen.getByText(row.score)).toBeInTheDocument();
    expect(screen.getByText(row.rate)).toBeInTheDocument();
    expect(screen.getByText(row.matches)).toBeInTheDocument();
  });
});
