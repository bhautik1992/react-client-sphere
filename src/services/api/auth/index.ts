import { authStore } from 'services/store/auth';

import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IChangePasswordReq, IForgotPwdReq, ISignInReq, ISignInRes } from './types';

const { actions } = authStore.getState();

export const authAPI = {
  // SignIn
  async signIn(data: ISignInReq): Promise<IApiSuccess<ISignInRes>> {
    return apiInstance
      .post(ApiEndPoints.auth.signIn, data)
      .then((response) => {
        actions.authSuccess(response);
        return response;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async forgotPassword(data: IForgotPwdReq): Promise<IApiSuccess<Record<string, string>>> {
    return apiInstance
      .post(ApiEndPoints.auth.forgotPassword, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async changePassword(data: IChangePasswordReq): Promise<IApiSuccess<Record<string, string>>> {
    return apiInstance
      .post(ApiEndPoints.auth.changePassword, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
