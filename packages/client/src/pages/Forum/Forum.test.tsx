import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Forum } from './Forum';

describe('Forum', () => {
  test('it renders', async () => {
    renderWithRouter({ component: <Forum /> });
    const forumTestId = 'forum-title';

    const renderedForum = await screen.findByTestId(forumTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
