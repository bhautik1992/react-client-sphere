import { create } from 'zustand';

import apiInstance from 'services/api';
import { ISignInRes } from 'services/api/auth/types';

import { LocalStorageKeys } from 'utils/constants';

export type IAuthStore = {
  isLoading: boolean;
  isLoggedIn: boolean;
  employeeData: ISignInRes;
  isSuperAdmin?: boolean;
};

interface IAuthAction {
  actions: {
    loaderChange: (status: IAuthStore['isLoading']) => void;
    authSuccess: (payload: { data: ISignInRes }) => void;
    authFail: () => void;
  };
}

export const authStore = create<IAuthStore & IAuthAction>((set) => ({
  // initial state
  isLoading: false,
  isLoggedIn: false,
  employeeData: {} as ISignInRes,

  // Actions
  actions: {
    loaderChange: (status) => set((state) => ({ ...state, isLoading: status })),
    authSuccess: (payload) =>
      set((state) => {
        apiInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${payload.data.access_token}`;
        localStorage.setItem(LocalStorageKeys.authToken, JSON.stringify(payload.data.access_token));
        localStorage.setItem(LocalStorageKeys.employee, JSON.stringify(payload.data));
        return {
          ...state,
          employeeData: payload.data,
          isLoggedIn: true
        };
      }),
    authFail: () =>
      set((state) => {
        delete apiInstance.defaults.headers.common['Authorization'];
        localStorage.removeItem(LocalStorageKeys.authToken);
        localStorage.removeItem(LocalStorageKeys.employee);
        return {
          ...state,
          employeeData: {} as ISignInRes,
          isLoggedIn: false
        };
      })
  }
}));
