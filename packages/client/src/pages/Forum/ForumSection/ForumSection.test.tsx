import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { forumAPI } from '../../../api/forumAPI/forumAPI';
import { renderWithRouter } from '../../../utils/testingUtils';
import { ForumSection } from './ForumSection';

describe('ForumSection', () => {
  test('it renders', async () => {
    await act(async () => {
      renderWithRouter({ component: <ForumSection />, routeLoader: async () => forumAPI.getSectionById(1) });
    });

    const forumSectionTestId = 'forum-section-title';

    const renderedForumSection = screen.getByTestId(forumSectionTestId);

    expect(renderedForumSection).toBeInTheDocument();
  });
});
