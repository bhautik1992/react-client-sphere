import { screen, waitFor } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import ForgotPassword from '.';

describe('ForgotPassword', () => {
  render(<ForgotPassword />);

  test('ForgotPassword page should render heading', () => {
    const forgotPwdHeading = screen.getByRole('heading', {
      name: /forgot password/i
    });
    expect(forgotPwdHeading).toBeInTheDocument();
  });

  test('ForgotPassword page should render input element', () => {
    waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/enter email id here\.\.\./i);
      expect(emailInput).toBeInTheDocument();
    });
  });
});
