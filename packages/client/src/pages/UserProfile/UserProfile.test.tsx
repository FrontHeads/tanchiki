import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { store } from '../../store';
import { userProfileFieldList } from './data';
import { UserProfile } from './UserProfile';

describe('UserProfile page', () => {
  test('it renders', async () => {
    await act(() => {
      render(
        <Provider store={store}>
          <UserProfile />;
        </Provider>
      );
    });
    await act(() => {
      const inputFieldsCount = userProfileFieldList.filter(item => !('heading' in item)).length;
      const headersCount = userProfileFieldList.filter(item => 'heading' in item).length;

      expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
      expect(screen.getAllByTestId('form-input-header').length).toBe(headersCount);
    });
  });
});
