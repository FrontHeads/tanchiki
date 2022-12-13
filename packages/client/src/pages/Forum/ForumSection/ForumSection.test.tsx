import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../utils/testingUtils';
import { ForumSection } from './ForumSection';

describe('ForumSection', () => {
  test('it renders', () => {
    renderWithRouter({ component: <ForumSection /> });
    const forumSectionTestId = 'forum-section-title';

    const renderedForumSection = screen.getByTestId(forumSectionTestId);

    expect(renderedForumSection).toBeInTheDocument();
  });
});
