import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { FormInputAndHeadingList } from '../../../app.typings';
import { FormFieldList } from './FormFieldList';

describe('FormFieldList', () => {
  test('it renders', () => {
    const testFieldId = 'email';

    const [formData, setFormData] = [{ [testFieldId]: '' }, jest.fn()];
    const mockFields: FormInputAndHeadingList = [
      {
        title: 'Email',
        type: 'email',
        id: testFieldId,
        placeholder: 'ivan@mail.ru',
        required: true,
      },
      {
        heading: 'Hello',
      },
    ];

    render(<FormFieldList formFieldList={mockFields} formData={formData} setFormData={setFormData} />);

    const inputFieldsCount = mockFields.filter(item => !('heading' in item)).length;
    const headersCount = mockFields.filter(item => 'heading' in item).length;

    expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
    expect(screen.getAllByTestId('form-input-header').length).toBe(headersCount);
  });
});
