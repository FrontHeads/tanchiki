import '@testing-library/jest-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { leaderboardLoader } from '../../config/leaderboardRoute';
import { fakeLeaderboardData } from '../../tests/data';
import { renderWithRouter } from '../../utils/testingUtils';
import { headerText } from './data';
import { Leaderboard } from './Leaderboard';

//ES6 import syntax is not working in this case
global.ResizeObserver = require('resize-observer-polyfill');

describe('Leaderboard', () => {
  const scoreFilterMinVal = 250;
  const rowsLength = fakeLeaderboardData.length;
  const rowsLengthAfterFilter = fakeLeaderboardData.filter(row => row.data.score > scoreFilterMinVal).length;
  const hideClassName = 'leaderboard__section_hide';
  const showClassName = 'leaderboard__section_show';

  beforeEach(async () => {
    await act(async () => {
      renderWithRouter({
        component: <Leaderboard header={headerText} />,
        routeLoader: leaderboardLoader,
      });
    });
  });

  test('it renders header', async () => {
    expect(screen.getByText(headerText)).toBeInTheDocument();
  });

  test('it renders leaderboard table', async () => {
    await waitFor(() => expect(screen.getAllByTestId('leaderboard-row')[0]).toBeInTheDocument());

    const leaderboardRows = screen.getAllByTestId('leaderboard-row');
    expect(leaderboardRows.length).toBe(rowsLength);
  });

  test('it sorted table', async () => {
    const scoreTableHead = screen.getByText('Очки');
    const rowList = await screen.findAllByTestId('leaderboard-row');
    const firstRow = rowList[0];
    expect(firstRow).toBeInTheDocument();

    fireEvent.click(scoreTableHead);
    const rowListArfterClick = await screen.findAllByTestId('leaderboard-row');
    const firstRowAfterClick = rowListArfterClick[0];
    expect(firstRowAfterClick).not.toEqual(firstRow);
    expect(firstRowAfterClick).toEqual(rowList[1]);

    fireEvent.click(scoreTableHead);
    const rowListArfterSecondClick = await screen.findAllByTestId('leaderboard-row');
    const firstRowAfterSecondClick = rowListArfterSecondClick[0];

    expect(firstRowAfterSecondClick).toEqual(firstRow);
  });

  test('it change filter visibility after click', async () => {
    const filterForm = screen.getByTestId('leaderboard__filter__form');
    const filterButton = screen.getByText(/ФИЛЬТР/);

    expect(filterForm).toBeInTheDocument();
    expect(filterForm).toHaveClass(hideClassName);

    fireEvent.click(filterButton);
    expect(filterForm).toHaveClass(showClassName);

    fireEvent.click(filterButton);
    expect(filterForm).toHaveClass(hideClassName);
  });

  test('it change chart visibility after click', async () => {
    const chart = screen.getByTestId('leaderboard__chart');
    const chartButton = screen.getByText(/ГРАФИК/);

    expect(chart).toBeInTheDocument();
    expect(chart).toHaveClass(hideClassName);

    fireEvent.click(chartButton);
    expect(chart).toHaveClass(showClassName);

    fireEvent.click(chartButton);
    expect(chart).toHaveClass(hideClassName);
  });

  test('it filtering rows by score and clear filter by clear-button click', async () => {
    const filterButton = screen.getByText(/ФИЛЬТР/);
    const clearButton = screen.getByTestId('leaderboard__filter__clear-btn');
    const input = screen.getByTestId('leaderboard__filter__score-input-min');

    expect(input).not.toHaveValue();

    const leaderboardRowsBeforeClick = screen.getAllByTestId('leaderboard-row');
    expect(leaderboardRowsBeforeClick.length).toBe(rowsLength);

    userEvent.click(filterButton);
    fireEvent.input(input, { target: { value: scoreFilterMinVal } });

    expect(input).toHaveValue(scoreFilterMinVal);
    const leaderboardRowsAfterClick = screen.getAllByTestId('leaderboard-row');
    expect(leaderboardRowsAfterClick.length).toBe(rowsLengthAfterFilter);

    fireEvent.click(clearButton);
    expect(input).not.toHaveValue();
    const leaderboardRowsAfterClear = screen.getAllByTestId('leaderboard-row');
    expect(leaderboardRowsAfterClear.length).toBe(rowsLength);
  });
});
