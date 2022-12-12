import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbsVariant } from './typings';

describe('Breadcrumbs', () => {
  test('it render', () => {
    const breadcrumbsItemText = 'Test Link';
    const data = [{ title: breadcrumbsItemText }];

    render(<Breadcrumbs variant={BreadcrumbsVariant.Wide} data={data} />);

    const renderedBreadcrumbs = screen.getByText(breadcrumbsItemText);

    expect(renderedBreadcrumbs).toBeInTheDocument();
  });
});
