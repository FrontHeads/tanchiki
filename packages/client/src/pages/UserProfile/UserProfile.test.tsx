import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { userProfileInputFields } from './data';
import { UserProfile } from './UserProfile';

describe('UserProfile page', () => {
  test('it renders', () => {
    render(<UserProfile />);

    const inputFieldsCount = userProfileInputFields.filter(item => !('heading' in item)).length;
    const headersCount = userProfileInputFields.filter(item => 'heading' in item).length;

    expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
    expect(screen.getAllByTestId('form-input-header').length).toBe(headersCount);
  });
});
