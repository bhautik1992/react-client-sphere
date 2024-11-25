import { authAPI } from 'services/api/auth';

import { useRequest } from '..';
import { authKeys } from '../queryKeys';

export const useSignIn = () => {
  return useRequest({
    mutationKey: authKeys.authMutate,
    mutationFn: authAPI.signIn
  });
};

export const useForgotPassword = () => {
  return useRequest({
    mutationFn: authAPI.forgotPassword,
    mutationKey: authKeys.authForgotPsw
  });
};

export const useChangePassword = () => {
  return useRequest({
    mutationFn: authAPI.changePassword,
    mutationKey: authKeys.authChangePsw
  });
};
