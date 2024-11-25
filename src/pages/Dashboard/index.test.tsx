import { screen, waitFor } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import Dashboard from '.';

describe('Dashboard', () => {
  render(<Dashboard />);

  test('Dashboard page should render reports', () => {
    waitFor(() => {
      const incidentHeading = screen.getByRole('heading', {
        name: /incident reports/i
      });
      const usersHeading = screen.getByRole('heading', {
        name: /users/i
      });
      const respondersHeading = screen.getByRole('heading', {
        name: /responders/i
      });
      const pendingHeading = screen.getByRole('heading', {
        name: /pending reports/i
      });

      expect(incidentHeading).toBeInTheDocument();
      expect(usersHeading).toBeInTheDocument();
      expect(respondersHeading).toBeInTheDocument();
      expect(pendingHeading).toBeInTheDocument();
    });
  });
});
