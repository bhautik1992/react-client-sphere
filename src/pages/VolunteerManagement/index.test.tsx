import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import VolunteerManagement from '.';

describe('Volunteer Management', () => {
  render(<VolunteerManagement />);

  test('Volunteer Management page should render reports', () => {
    const volunteerHeading = screen.getByRole('heading', {
      name: /Responders/i
    });

    expect(volunteerHeading).toBeInTheDocument();
  });
});
