import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { userProfileFieldList } from './data';
import { UserProfile } from './UserProfile';

describe('UserProfile page', () => {
  test('it renders', () => {
    renderWithRouter({ component: <UserProfile /> });
    const inputFieldsCount = userProfileFieldList.filter(item => !('heading' in item)).length;
    const headersCount = userProfileFieldList.filter(item => 'heading' in item).length;

    expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
    expect(screen.getAllByTestId('form-input-header').length).toBe(headersCount);
  });
});
