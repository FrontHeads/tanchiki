import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { FormInputAndHeadingList } from '../../../app.typings';
import { FieldList } from './FieldList';

describe('FieldList', () => {
  test('it renders', () => {
    const testFieldId = 'email';

    const [formData, setFormData] = [{ [testFieldId]: '' }, jest.fn()];
    const [isFormSubmitted, setIsFormSubmitted] = [false, jest.fn()];
    const mockFn = jest.fn();
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

    render(
      <FieldList
        fieldList={mockFields}
        formData={formData}
        setFormData={setFormData}
        isFormSubmitted={isFormSubmitted}
        onFormSubmitCallback={mockFn}
        setIsFormSubmitted={setIsFormSubmitted}
        validation={mockFn}
      />
    );

    const inputFieldsCount = mockFields.filter(item => !('heading' in item)).length;
    const headersCount = mockFields.filter(item => 'heading' in item).length;

    expect(screen.getAllByTestId('form-field').length).toBe(inputFieldsCount);
    expect(screen.getAllByTestId('form-input-header').length).toBe(headersCount);
  });
});
