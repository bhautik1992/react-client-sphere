import { screen } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import TrainingManagement from '.';

describe('Training Management', () => {
  render(<TrainingManagement />);

  test('Training Management page should render reports', () => {
    const trainingHeading = screen.getByRole('heading', {
      name: /training management/i
    });

    expect(trainingHeading).toBeInTheDocument();
  });
});
