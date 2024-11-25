import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IDashboardReq, IDashboardRes } from './types';

export const dashboardAPI = {
  async dashboardCount(data: IDashboardReq): Promise<IDashboardRes> {
    const queryString =
      data?.startDate && data?.endDate
        ? `?startDate=${data?.startDate}&endDate=${data?.endDate}`
        : '';
    return apiInstance
      .get(`${ApiEndPoints.dashboard.dashboardCount}${queryString}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
