import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Contact } from './Contact';
import { contactUsFieldList } from './data';

describe('Contact page', () => {
  test('it renders', () => {
    renderWithRouter({ component: <Contact /> });
    const inputFieldsCount = contactUsFieldList.filter(item => !('heading' in item)).length;

    expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
    expect(screen.getByTestId('contact-submit-button')).toBeInTheDocument();
  });
});
