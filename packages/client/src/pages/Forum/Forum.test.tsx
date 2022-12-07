import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Forum } from './Forum';
describe('Forum', () => {
  test('it renders', () => {
    render(<Forum />, { wrapper: MemoryRouter });
    const forumTestId = 'forum';

    const renderedForum = screen.getByTestId(forumTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
