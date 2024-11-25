import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { render } from 'test/utils';
import { describe, vi } from 'vitest';

import { Role } from 'services/api/types';

import { ROUTES } from 'utils/constants/routes';

import ChangePassword from '.';

describe('Change Password', () => {
  render(<ChangePassword />);

  // Mock useNavigate and useSignIn hooks
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...(actual as object),
      useNavigate: vi.fn()
    };
  });

  vi.mock('services/hooks/auth', () => ({
    useChangePassword: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false
    }))
  }));

  test('Change Password page should render heading', () => {
    const changePwdHeading = screen.getByRole('heading', {
      name: /change password/i
    });
    expect(changePwdHeading).toBeInTheDocument();
  });

  test('Change Password page should render input element', () => {
    waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/enter your email id here\.\.\./i);
      expect(emailInput).toBeInTheDocument();
    });
  });

  test('submitting form with valid data triggers change and navigation', async () => {
    waitFor(async () => {
      const navigate = useNavigate();
      const mockMutate = vi.fn().mockResolvedValue({});

      // Fill form with valid data
      const oldPasswordInput = screen.getByLabelText(/Old Password/i);
      const newPasswordInput = screen.getByLabelText(/New Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Submit/i });

      fireEvent.change(oldPasswordInput, { target: { value: 'StrongP@ss123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'NewStrongP@ssword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'NewStrongP@ssword123' } });
      fireEvent.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith({
        password: 'StrongP@ss123',
        newPassword: 'NewStrongP@ssword123',
        userType: Role.VOLUNTEER
      });

      await Promise.resolve(); // Wait for async operations

      expect(navigate).toHaveBeenCalledWith(ROUTES.signIn);
    });
  });

  test('submitting form with mismatched passwords displays error', () => {
    waitFor(async () => {
      const newPasswordInput = screen.getByLabelText(/New Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const submitButton = screen.getByRole('button', { name: /Submit/i });

      fireEvent.change(newPasswordInput, { target: { value: 'StrongP@ss123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'weakPassword' } });
      fireEvent.click(submitButton);

      expect(
        screen.getByText(/New password and confirm password do not match/i)
      ).toBeInTheDocument();
    });
  });
});
