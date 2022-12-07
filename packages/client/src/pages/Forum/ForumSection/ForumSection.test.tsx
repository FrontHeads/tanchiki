import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ForumSection } from './ForumSection';

describe('ForumSection', () => {
  test('it renders', () => {
    render(<ForumSection />, { wrapper: MemoryRouter });
    const forumSectionTestId = 'forum-section';

    const renderedForumSection = screen.getByTestId(forumSectionTestId);

    expect(renderedForumSection).toBeInTheDocument();
  });
});
