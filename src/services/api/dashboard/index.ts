import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IDashboardRes } from './types';

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
  }
};
