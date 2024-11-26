import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import ClientManagement from '.';

describe('Client Management', () => {
  render(<ClientManagement />);

  test('Client Management page should render reports', () => {
    const clientHeading = screen.getByRole('heading', {
      name: /Client/i
    });

    expect(clientHeading).toBeInTheDocument();
  });
});
