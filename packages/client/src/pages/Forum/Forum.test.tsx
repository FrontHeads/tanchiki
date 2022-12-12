import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Forum } from './Forum';

describe('Forum', () => {
  test('it renders', () => {
    renderWithRouter({ component: <Forum /> });
    const forumTestId = 'forum';

    const renderedForum = screen.getByTestId(forumTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
