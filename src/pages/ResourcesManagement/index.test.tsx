import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import ResourcesManagement from '.';

describe('Resources Management', () => {
  render(<ResourcesManagement />);

  test('Resources Management page should render reports', () => {
    const resourcesHeading = screen.getByRole('heading', {
      name: /Resources Management/i
    });

    expect(resourcesHeading).toBeInTheDocument();
  });
});
