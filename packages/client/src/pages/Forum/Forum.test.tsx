import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { headerText, Forum } from './Forum';
describe('Forum', () => {
  test('it renders', () => {
    render(<Forum />, { wrapper: MemoryRouter });
    const forumTestId = 'forum';

    const renderedForum = screen.getByTestId(forumTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
