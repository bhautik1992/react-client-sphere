import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import CMSManagement from '.';

describe('CMS Management', () => {
  render(<CMSManagement />);

  test('CMS Management page should render reports', () => {
    const cmsHeading = screen.getByRole('heading', {
      name: /CMS Management/i
    });

    expect(cmsHeading).toBeInTheDocument();
  });
});
