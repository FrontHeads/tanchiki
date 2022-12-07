import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../utils/testing-utils';
import { ForumSection } from './ForumSection';

describe('ForumSection', () => {
  test('it renders', () => {
    renderWithRouter({ component: <ForumSection /> });
    const forumSectionTestId = 'forum-section';

    const renderedForumSection = screen.getByTestId(forumSectionTestId);

    expect(renderedForumSection).toBeInTheDocument();
  });
});
