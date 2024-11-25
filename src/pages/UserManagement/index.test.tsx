import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import UserManagement from '.';

describe('User', () => {
  render(<UserManagement />);

  test('User page should render reports', () => {
    const userHeading = screen.getByRole('heading', {
      name: /user/i
    });

    expect(userHeading).toBeInTheDocument();
  });
});
