import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IDashboardClientRes,
  IDashboardCompanyRes,
  IDashboardRes,
  IDashboardUserRes
} from './types';

export const dashboardAPI = {
  async dashboardCount(): Promise<IDashboardRes> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardCount}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async dashboardClient(): Promise<IDashboardClientRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardClient}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async dashboardCompany(): Promise<IDashboardCompanyRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardCompany}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async dashboardUser(): Promise<IDashboardUserRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardUser}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
