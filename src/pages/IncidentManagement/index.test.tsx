import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import IncidentManagement from '.';

describe('Incident Management', () => {
  render(<IncidentManagement />);

  test('Incident Management page should render reports', () => {
    const incidentHeading = screen.getByRole('heading', {
      name: /incident/i
    });

    expect(incidentHeading).toBeInTheDocument();
  });
});
