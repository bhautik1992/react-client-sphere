import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from 'test/utils';
import { describe } from 'vitest';

import { ROUTES } from 'utils/constants/routes';

import MyProfile from '.';

describe('My Profile', () => {
  render(<MyProfile />);

  test('MyProfile renders profile details when data is available', () => {
    waitFor(() => {
      const mockProfileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890'
      };

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.firstName)).toBeInTheDocument();

      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.lastName)).toBeInTheDocument();

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.email)).toBeInTheDocument();

      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.phoneNumber)).toBeInTheDocument();
    });
  });

  test('MyProfile displays placeholder for missing data', () => {
    waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();

      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();

      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  test('MyProfile navigates to edit profile page on button click', () => {
    waitFor(() => {
      const mockNavigate = jest.fn();

      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.editMyProfile);
    });
  });
});
