import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import SupportCallNumber from '.';

describe('Support call number', () => {
  render(<SupportCallNumber />);

  test('Support call number page should render reports', () => {
    const supportCallHeading = screen.getByRole('heading', {
      name: /Support Call Number/i
    });

    expect(supportCallHeading).toBeInTheDocument();
  });
});
