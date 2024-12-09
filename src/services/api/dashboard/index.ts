import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IDashboardClientRes,
  IDashboardCompanyRes,
  IDashboardEmployeeRes,
  IDashboardProjectRes,
  IDashboardRes
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

  async dashboardEmployee(): Promise<IDashboardEmployeeRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardEmployee}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async dashboardProject(): Promise<IDashboardProjectRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardProject}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
